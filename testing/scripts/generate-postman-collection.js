const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, '..', 'postman', 'Servify.API.postman_collection.json');

const toExec = (script) =>
  script
    .trim()
    .split('\n')
    .map((line) => line.replace(/\t/g, '    '));

const makeRequest = ({ name, method, endpoint, headers = {}, body, testScript, prerequestScript }) => {
  const item = {
    name,
    request: {
      method,
      header: Object.entries(headers).map(([key, value]) => ({ key, value })),
      url: `{{baseUrl}}${endpoint}`
    }
  };

  if (body !== undefined) {
    item.request.body = {
      mode: 'raw',
      raw: typeof body === 'string' ? body : JSON.stringify(body, null, 2),
      options: {
        raw: {
          language: 'json'
        }
      }
    };
  }

  const events = [];

  if (prerequestScript) {
    events.push({
      listen: 'prerequest',
      script: {
        type: 'text/javascript',
        exec: toExec(prerequestScript)
      }
    });
  }

  if (testScript) {
    events.push({
      listen: 'test',
      script: {
        type: 'text/javascript',
        exec: toExec(testScript)
      }
    });
  }

  if (events.length) {
    item.event = events;
  }

  return item;
};

const authHeader = (tokenVar) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer {{${tokenVar}}}`
});

const responseHelpers = `
const parseJsonSafe = () => {
  const type = String(pm.response.headers.get('Content-Type') || '').toLowerCase();
  if (!type.includes('application/json')) return null;
  try {
    return pm.response.json();
  } catch (err) {
    return null;
  }
};

const asArray = (json, key) => {
  if (Array.isArray(json)) return json;
  if (json && Array.isArray(json[key])) return json[key];
  return [];
};

const asEntity = (json, key) => {
  if (!json || typeof json !== 'object') return null;
  if (key && json[key] && typeof json[key] === 'object' && !Array.isArray(json[key])) return json[key];
  if (json.data && typeof json.data === 'object' && !Array.isArray(json.data)) return json.data;
  if (json.result && typeof json.result === 'object' && !Array.isArray(json.result)) return json.result;
  if (json.id || json._id) return json;
  return null;
};

const getId = (entity) => {
  if (!entity || typeof entity !== 'object') return '';
  return String(entity.id || entity._id || '');
};
`;

const jwtHelper = `
const decodeJwtPayload = (token) => {
  if (!token || token.split('.').length !== 3) return null;
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(jsonPayload);
};
`;

const initDynamicDataScript = `
const isInitRequest = pm.info.requestName === 'Init Dynamic Data (Bootstrap)';
if (isInitRequest || !pm.collectionVariables.get('runId')) {
  const runId = String(Date.now());
  pm.collectionVariables.set('runId', runId);
  pm.collectionVariables.set('categoryOneName', 'Cleaning ' + runId);
  pm.collectionVariables.set('categoryTwoName', 'Plumbing ' + runId);
  pm.collectionVariables.set('serviceOneTitle', 'Home Cleaning ' + runId);
  pm.collectionVariables.set('serviceTwoTitle', 'Pipe Repair ' + runId);
  pm.collectionVariables.set('nonExistentBookingId', '00000000-0000-0000-0000-000000000000');
}
`;

const initRequest = makeRequest({
  name: 'Init Dynamic Data (Bootstrap)',
  method: 'GET',
  endpoint: '/api/v1/categories/',
  headers: { 'Content-Type': 'application/json' },
  prerequestScript: initDynamicDataScript,
  testScript: `
pm.test('Initialization request completed', function () {
  pm.expect([200, 500]).to.include(pm.response.code);
});
`
});

const adminLogin = makeRequest({
  name: 'Admin Login',
  method: 'POST',
  endpoint: '/api/v1/auth/login',
  headers: { 'Content-Type': 'application/json' },
  body: {
    email: '{{adminEmail}}',
    password: '{{adminPassword}}'
  },
  testScript: `
${jwtHelper}
${responseHelpers}
pm.test('Admin login returns 200', function () {
  pm.response.to.have.status(200);
});

const json = parseJsonSafe();
pm.expect(json && json.accessToken, 'Expected accessToken').to.be.a('string');
pm.collectionVariables.set('adminAccessToken', json.accessToken);

const payload = decodeJwtPayload(json.accessToken);
if (payload && payload.role) pm.collectionVariables.set('adminTokenRole', payload.role);
if (payload && payload.id) pm.collectionVariables.set('adminUserId', payload.id);
`
});

const providerLogin = makeRequest({
  name: 'Provider Login',
  method: 'POST',
  endpoint: '/api/v1/auth/login',
  headers: { 'Content-Type': 'application/json' },
  body: {
    email: '{{providerEmail}}',
    password: '{{providerPassword}}'
  },
  testScript: `
${jwtHelper}
${responseHelpers}
pm.test('Provider login returns 200', function () {
  pm.response.to.have.status(200);
});

const json = parseJsonSafe();
pm.expect(json && json.accessToken, 'Expected accessToken').to.be.a('string');
pm.collectionVariables.set('providerAccessToken', json.accessToken);

const payload = decodeJwtPayload(json.accessToken);
if (payload && payload.role) pm.collectionVariables.set('providerTokenRole', payload.role);
if (payload && payload.id) pm.collectionVariables.set('providerUserId', payload.id);
`
});

const providerProfile = makeRequest({
  name: 'Provider Profile Snapshot',
  method: 'GET',
  endpoint: '/api/v1/users/profile',
  headers: authHeader('providerAccessToken'),
  testScript: `
${responseHelpers}
pm.test('Provider profile returns 200', function () {
  pm.response.to.have.status(200);
});

const json = parseJsonSafe();
pm.expect(json && json.id, 'Expected provider id').to.be.a('string');
pm.collectionVariables.set('providerUserId', String(json.id));
pm.collectionVariables.set('providerUserType', String(json.user_type || ''));
`
});

const promoteProvider = makeRequest({
  name: 'Promote Provider If Needed',
  method: 'PATCH',
  endpoint: '/api/v1/users/promote',
  headers: authHeader('providerAccessToken'),
  body: {},
  testScript: `
${jwtHelper}
${responseHelpers}
pm.test('Promote endpoint returns expected status', function () {
  pm.expect([200, 400, 403]).to.include(pm.response.code);
});

if (pm.response.code === 200) {
  const json = parseJsonSafe();
  if (json && json.accessToken) {
    pm.collectionVariables.set('providerAccessToken', json.accessToken);
    const payload = decodeJwtPayload(json.accessToken);
    if (payload && payload.role) pm.collectionVariables.set('providerTokenRole', payload.role);
  }
}
`
});

const providerRefreshRoleSync = makeRequest({
  name: 'Provider Refresh Token Role Sync',
  method: 'POST',
  endpoint: '/api/v1/auth/refresh',
  headers: { 'Content-Type': 'application/json' },
  body: {},
  testScript: `
${jwtHelper}
${responseHelpers}
pm.test('Provider refresh returns 200', function () {
  pm.response.to.have.status(200);
});

const json = parseJsonSafe();
pm.expect(json && json.accessToken, 'Expected refreshed accessToken').to.be.a('string');
pm.collectionVariables.set('providerAccessToken', json.accessToken);

const payload = decodeJwtPayload(json.accessToken);
pm.expect(payload && payload.role, 'Expected role claim').to.be.a('string');
pm.collectionVariables.set('providerTokenRole', payload.role);
pm.test('Refreshed provider token has provider role', function () {
  pm.expect(payload.role).to.eql('provider');
});
`
});

const providerProfileAfterSync = makeRequest({
  name: 'Provider Profile After Role Sync',
  method: 'GET',
  endpoint: '/api/v1/users/profile',
  headers: authHeader('providerAccessToken'),
  testScript: `
${responseHelpers}
pm.test('Provider profile after sync returns 200', function () {
  pm.response.to.have.status(200);
});

const json = parseJsonSafe();
pm.expect(json && json.id, 'Expected provider id').to.be.a('string');
pm.collectionVariables.set('providerUserId', String(json.id));
pm.collectionVariables.set('providerUserType', String(json.user_type || ''));
pm.test('Provider profile reports provider role', function () {
  pm.expect(String(json.user_type || '')).to.eql('provider');
});
`
});

const clientLogin = makeRequest({
  name: 'Client Login',
  method: 'POST',
  endpoint: '/api/v1/auth/login',
  headers: { 'Content-Type': 'application/json' },
  body: {
    email: '{{clientEmail}}',
    password: '{{clientPassword}}'
  },
  testScript: `
${jwtHelper}
${responseHelpers}
pm.test('Client login returns 200', function () {
  pm.response.to.have.status(200);
});

const json = parseJsonSafe();
pm.expect(json && json.accessToken, 'Expected accessToken').to.be.a('string');
pm.collectionVariables.set('clientAccessToken', json.accessToken);

const payload = decodeJwtPayload(json.accessToken);
if (payload && payload.role) pm.collectionVariables.set('clientTokenRole', payload.role);
if (payload && payload.id) pm.collectionVariables.set('clientUserId', payload.id);
`
});

const clientProfile = makeRequest({
  name: 'Client Profile Snapshot',
  method: 'GET',
  endpoint: '/api/v1/users/profile',
  headers: authHeader('clientAccessToken'),
  testScript: `
${responseHelpers}
pm.test('Client profile returns 200', function () {
  pm.response.to.have.status(200);
});

const json = parseJsonSafe();
pm.expect(json && json.id, 'Expected client id').to.be.a('string');
pm.collectionVariables.set('clientUserId', String(json.id));
pm.collectionVariables.set('clientUserType', String(json.user_type || ''));
`
});

const usersSnapshot = makeRequest({
  name: 'DB Snapshot Users (Admin)',
  method: 'GET',
  endpoint: '/api/v1/users/',
  headers: authHeader('adminAccessToken'),
  testScript: `
${responseHelpers}
pm.test('Admin list users returns 200', function () {
  pm.response.to.have.status(200);
});

const json = parseJsonSafe();
const users = asArray(json, 'users');
pm.expect(users, 'Expected users array').to.be.an('array');
pm.collectionVariables.set('usersCount', String(users.length));
`
});

const usersListNonAdmin = makeRequest({
  name: 'Client List Users Forbidden',
  method: 'GET',
  endpoint: '/api/v1/users/',
  headers: authHeader('clientAccessToken'),
  testScript: `
pm.test('Client list users returns 403', function () {
  pm.response.to.have.status(403);
});
`
});

const categoriesSnapshot = makeRequest({
  name: 'DB Snapshot Categories (Public)',
  method: 'GET',
  endpoint: '/api/v1/categories/',
  headers: { 'Content-Type': 'application/json' },
  testScript: `
${responseHelpers}
pm.test('Public categories returns 200', function () {
  pm.response.to.have.status(200);
});

const json = parseJsonSafe();
const categories = asArray(json, 'categories');
pm.expect(categories, 'Expected categories array').to.be.an('array');
pm.collectionVariables.set('categoriesCount', String(categories.length));

const runId = pm.collectionVariables.get('runId');
const nameOne = 'Cleaning ' + runId;
const nameTwo = 'Plumbing ' + runId;

const existingOne = categories.find((c) => c && c.name === nameOne);
const existingTwo = categories.find((c) => c && c.name === nameTwo);

if (!pm.collectionVariables.get('categoryOneId')) {
  if (existingOne && existingOne.id !== undefined) {
    pm.collectionVariables.set('categoryOneId', String(existingOne.id));
  } else if (categories[0] && categories[0].id !== undefined) {
    pm.collectionVariables.set('categoryOneId', String(categories[0].id));
  }
}

if (!pm.collectionVariables.get('categoryTwoId')) {
  if (existingTwo && existingTwo.id !== undefined) {
    pm.collectionVariables.set('categoryTwoId', String(existingTwo.id));
  } else if (categories[1] && categories[1].id !== undefined) {
    pm.collectionVariables.set('categoryTwoId', String(categories[1].id));
  } else if (pm.collectionVariables.get('categoryOneId')) {
    pm.collectionVariables.set('categoryTwoId', String(pm.collectionVariables.get('categoryOneId')));
  }
}
`
});

const createCategoryOne = makeRequest({
  name: 'Admin Create Category 1',
  method: 'POST',
  endpoint: '/api/v1/categories/',
  headers: authHeader('adminAccessToken'),
  body: {
    name: '{{categoryOneName}}',
    description: 'Automation test category: cleaning services'
  },
  testScript: `
${responseHelpers}
pm.test('Create category 1 returns 201', function () {
  pm.response.to.have.status(201);
});

const json = parseJsonSafe();
const category = asEntity(json, 'category');
const id = getId(category);
pm.expect(id, 'Expected category id').to.not.eql('');
pm.collectionVariables.set('categoryOneId', id);
`
});

const createCategoryTwo = makeRequest({
  name: 'Admin Create Category 2',
  method: 'POST',
  endpoint: '/api/v1/categories/',
  headers: authHeader('adminAccessToken'),
  body: {
    name: '{{categoryTwoName}}',
    description: 'Automation test category: plumbing services'
  },
  testScript: `
${responseHelpers}
pm.test('Create category 2 returns 201', function () {
  pm.response.to.have.status(201);
});

const json = parseJsonSafe();
const category = asEntity(json, 'category');
const id = getId(category);
pm.expect(id, 'Expected category id').to.not.eql('');
pm.collectionVariables.set('categoryTwoId', id);
`
});

const getCategoryById = makeRequest({
  name: 'Public Get Category By ID',
  method: 'GET',
  endpoint: '/api/v1/categories/{{categoryOneId}}',
  headers: { 'Content-Type': 'application/json' },
  testScript: `
pm.test('Get category by id returns 200', function () {
  pm.response.to.have.status(200);
});
`
});

const createServiceOne = makeRequest({
  name: 'Provider Create Service 1',
  method: 'POST',
  endpoint: '/api/v1/services/create',
  headers: authHeader('providerAccessToken'),
  prerequestScript: `
if (!pm.collectionVariables.get('categoryOneId') && pm.collectionVariables.get('categoryTwoId')) {
  pm.collectionVariables.set('categoryOneId', pm.collectionVariables.get('categoryTwoId'));
}
`,
  body: {
    category_id: '{{categoryOneId}}',
    title: '{{serviceOneTitle}}',
    description: 'Full apartment deep cleaning',
    price: 1500,
    service_type: 'onsite',
    location: 'Makati, Metro Manila'
  },
  testScript: `
${responseHelpers}
pm.test('Create service 1 returns 201', function () {
  pm.response.to.have.status(201);
});
const json = parseJsonSafe();
const service = asEntity(json);
const id = getId(service);
pm.expect(id, 'Expected service id').to.not.eql('');
pm.collectionVariables.set('serviceId', id);
`
});

const createServiceTwo = makeRequest({
  name: 'Provider Create Service 2',
  method: 'POST',
  endpoint: '/api/v1/services/create',
  headers: authHeader('providerAccessToken'),
  prerequestScript: `
if (!pm.collectionVariables.get('categoryTwoId') && pm.collectionVariables.get('categoryOneId')) {
  pm.collectionVariables.set('categoryTwoId', pm.collectionVariables.get('categoryOneId'));
}
`,
  body: {
    category_id: '{{categoryTwoId}}',
    title: '{{serviceTwoTitle}}',
    description: 'Leak and pipe repair',
    price: 1200,
    service_type: 'onsite',
    location: 'Taguig, Metro Manila'
  },
  testScript: `
${responseHelpers}
pm.test('Create service 2 returns 201', function () {
  pm.response.to.have.status(201);
});
const json = parseJsonSafe();
const service = asEntity(json);
const id = getId(service);
pm.expect(id, 'Expected service id').to.not.eql('');
pm.collectionVariables.set('serviceTwoId', id);
`
});

const servicesSnapshot = makeRequest({
  name: 'DB Snapshot Services (Client)',
  method: 'GET',
  endpoint: '/api/v1/services/',
  headers: authHeader('clientAccessToken'),
  testScript: `
${responseHelpers}
pm.test('Get all services returns 200', function () {
  pm.response.to.have.status(200);
});

const json = parseJsonSafe();
const services = asArray(json, 'services');
pm.expect(services, 'Expected services array').to.be.an('array');
pm.collectionVariables.set('servicesCount', String(services.length));

const runId = pm.collectionVariables.get('runId');
const nameOne = 'Home Cleaning ' + runId;
const nameTwo = 'Pipe Repair ' + runId;

const foundOne = services.find((s) => s && s.title === nameOne) || services[0];
const foundTwo = services.find((s) => s && s.title === nameTwo) || services[1] || foundOne;

if (foundOne && foundOne.id) pm.collectionVariables.set('serviceId', String(foundOne.id));
if (foundTwo && foundTwo.id) pm.collectionVariables.set('serviceTwoId', String(foundTwo.id));
`
});

const getServiceByIdAsClient = makeRequest({
  name: 'Client Get Service By ID',
  method: 'GET',
  endpoint: '/api/v1/services/{{serviceId}}',
  headers: authHeader('clientAccessToken'),
  testScript: `
${responseHelpers}
pm.test('Get service by id returns 200', function () {
  pm.response.to.have.status(200);
});

const json = parseJsonSafe();
const service = asEntity(json);
pm.expect(getId(service), 'Expected service id').to.eql(String(pm.collectionVariables.get('serviceId') || ''));
`
});

const editServiceOne = makeRequest({
  name: 'Provider Edit Service 1',
  method: 'PUT',
  endpoint: '/api/v1/services/edit/{{serviceId}}',
  headers: authHeader('providerAccessToken'),
  body: {
    title: 'Premium {{serviceOneTitle}}',
    description: 'Updated deep cleaning service',
    price: 2000,
    service_type: 'onsite',
    location: 'BGC, Taguig'
  },
  testScript: `
pm.test('Edit service returns 200', function () {
  pm.response.to.have.status(200);
});
`
});

const createBooking = makeRequest({
  name: 'Client Create Booking',
  method: 'POST',
  endpoint: '/api/v1/bookings/createBooking',
  headers: authHeader('clientAccessToken'),
  prerequestScript: `
const deps = ['serviceId', 'clientUserId', 'providerUserId'];
const missing = deps.filter((k) => !pm.collectionVariables.get(k));
if (missing.length) {
  throw new Error('Missing booking dependencies: ' + missing.join(', '));
}
`,
  body: {
    service_id: '{{serviceId}}',
    client_id: '{{clientUserId}}',
    provider_id: '{{providerUserId}}',
    booking_date: '2026-03-15',
    booking_time: '14:00',
    user_location: '123 Main St, Makati City',
    total_price: 1500,
    notes: 'Please bring cleaning supplies'
  },
  testScript: `
${responseHelpers}
pm.test('Create booking returns 201', function () {
  pm.response.to.have.status(201);
});

const json = parseJsonSafe();
const booking = asEntity(json);
const id = getId(booking);
pm.expect(id, 'Expected booking id').to.not.eql('');
pm.collectionVariables.set('bookingId', id);
`
});

const bookingsSnapshotClient = makeRequest({
  name: 'DB Snapshot Bookings (Client)',
  method: 'GET',
  endpoint: '/api/v1/bookings/client/{{clientUserId}}',
  headers: authHeader('clientAccessToken'),
  testScript: `
${responseHelpers}
pm.test('Get client bookings returns 200', function () {
  pm.response.to.have.status(200);
});

const json = parseJsonSafe();
const bookings = asArray(json, 'bookings');
pm.expect(bookings, 'Expected bookings array').to.be.an('array');
pm.collectionVariables.set('clientBookingsCount', String(bookings.length));

const serviceId = String(pm.collectionVariables.get('serviceId') || '');
const matched = bookings.find((b) => b && String(b.service_id || '') === serviceId) || bookings[0];
if (matched && matched.id) pm.collectionVariables.set('bookingId', String(matched.id));
pm.expect(pm.collectionVariables.get('bookingId'), 'Expected bookingId after bookings snapshot').to.be.a('string');
`
});

const getAllBookingsClient = makeRequest({
  name: 'Client Get All Bookings',
  method: 'GET',
  endpoint: '/api/v1/bookings/',
  headers: authHeader('clientAccessToken'),
  testScript: `
${responseHelpers}
pm.test('Get all bookings returns 200', function () {
  pm.response.to.have.status(200);
});
const json = parseJsonSafe();
const bookings = asArray(json, 'bookings');
pm.expect(bookings).to.be.an('array');
pm.collectionVariables.set('allBookingsCount', String(bookings.length));
`
});

const getProviderBookings = makeRequest({
  name: 'Provider Get Incoming Bookings',
  method: 'GET',
  endpoint: '/api/v1/bookings/provider/{{providerUserId}}',
  headers: authHeader('providerAccessToken'),
  testScript: `
pm.test('Get provider bookings returns 200', function () {
  pm.response.to.have.status(200);
});
`
});

const acceptBooking = makeRequest({
  name: 'Provider Accept Booking',
  method: 'PATCH',
  endpoint: '/api/v1/bookings/{{bookingId}}/status',
  headers: authHeader('providerAccessToken'),
  body: {
    status: 'accepted'
  },
  testScript: `
pm.test('Accept booking returns 200', function () {
  pm.response.to.have.status(200);
});
`
});

const completeBooking = makeRequest({
  name: 'Provider Complete Booking',
  method: 'PATCH',
  endpoint: '/api/v1/bookings/{{bookingId}}/status',
  headers: authHeader('providerAccessToken'),
  body: {
    status: 'completed'
  },
  testScript: `
pm.test('Complete booking returns 200', function () {
  pm.response.to.have.status(200);
});
`
});

const providerLoginForLifecycle = makeRequest({
  name: 'Provider Login For Token Lifecycle',
  method: 'POST',
  endpoint: '/api/v1/auth/login',
  headers: { 'Content-Type': 'application/json' },
  body: {
    email: '{{providerEmail}}',
    password: '{{providerPassword}}'
  },
  testScript: `
${responseHelpers}
pm.test('Provider login for token lifecycle returns 200', function () {
  pm.response.to.have.status(200);
});
const json = parseJsonSafe();
pm.expect(json && json.accessToken).to.be.a('string');
pm.collectionVariables.set('providerAccessToken', json.accessToken);
`
});

const refreshToken = makeRequest({
  name: 'Provider Refresh Access Token',
  method: 'POST',
  endpoint: '/api/v1/auth/refresh',
  headers: { 'Content-Type': 'application/json' },
  body: {},
  testScript: `
${responseHelpers}
pm.test('Refresh token returns 200', function () {
  pm.response.to.have.status(200);
});
const json = parseJsonSafe();
pm.expect(json && json.accessToken, 'Expected refreshed accessToken').to.be.a('string');
pm.collectionVariables.set('providerAccessToken', json.accessToken);
`
});

const logout = makeRequest({
  name: 'Provider Logout',
  method: 'POST',
  endpoint: '/api/v1/auth/logout',
  headers: { 'Content-Type': 'application/json' },
  body: {},
  testScript: `
pm.test('Logout returns 200', function () {
  pm.response.to.have.status(200);
});
`
});

const refreshAfterLogout = makeRequest({
  name: 'Provider Refresh After Logout',
  method: 'POST',
  endpoint: '/api/v1/auth/refresh',
  headers: { 'Content-Type': 'application/json' },
  body: {},
  testScript: `
pm.test('Refresh after logout is denied', function () {
  pm.expect([401, 403]).to.include(pm.response.code);
});
`
});

const noTokenProfile = makeRequest({
  name: 'No Token Profile Request',
  method: 'GET',
  endpoint: '/api/v1/users/profile',
  headers: { 'Content-Type': 'application/json' },
  testScript: `
pm.test('Profile without token returns 401', function () {
  pm.response.to.have.status(401);
});
`
});

const clientForbiddenServiceCreate = makeRequest({
  name: 'Client Tries To Create Service',
  method: 'POST',
  endpoint: '/api/v1/services/create',
  headers: authHeader('clientAccessToken'),
  body: {
    category_id: '{{categoryOneId}}',
    title: 'Forbidden Service Attempt',
    description: 'Should fail by role check',
    price: 900,
    service_type: 'onsite',
    location: 'Makati'
  },
  testScript: `
pm.test('Client cannot create service', function () {
  pm.response.to.have.status(403);
});
`
});

const nonAdminChangeRole = makeRequest({
  name: 'Client Change Role Forbidden',
  method: 'PATCH',
  endpoint: '/api/v1/users/{{providerUserId}}/role',
  headers: authHeader('clientAccessToken'),
  body: {
    user_type: 'admin'
  },
  testScript: `
pm.test('Client cannot change roles', function () {
  pm.response.to.have.status(403);
});
`
});

const bookingStatusMissingBody = makeRequest({
  name: 'Update Booking Status Missing Body',
  method: 'PATCH',
  endpoint: '/api/v1/bookings/{{nonExistentBookingId}}/status',
  headers: authHeader('clientAccessToken'),
  body: {},
  testScript: `
pm.test('Missing status returns 400', function () {
  pm.response.to.have.status(400);
});
`
});

const deleteBookingRequest = makeRequest({
  name: 'Delete Booking',
  method: 'DELETE',
  endpoint: '/api/v1/bookings/{{bookingId}}',
  headers: authHeader('clientAccessToken'),
  testScript: `
pm.test('Delete booking returns 200 or 404', function () {
  pm.expect([200, 404]).to.include(pm.response.code);
});
`
});

const deleteServiceOne = makeRequest({
  name: 'Provider Delete Service 1',
  method: 'DELETE',
  endpoint: '/api/v1/services/{{serviceId}}',
  headers: authHeader('providerAccessToken'),
  testScript: `
pm.test('Delete service 1 returns 200 or 404', function () {
  pm.expect([200, 404]).to.include(pm.response.code);
});
`
});

const deleteServiceTwo = makeRequest({
  name: 'Provider Delete Service 2',
  method: 'DELETE',
  endpoint: '/api/v1/services/{{serviceTwoId}}',
  headers: authHeader('providerAccessToken'),
  testScript: `
pm.test('Delete service 2 returns 200 or 404', function () {
  pm.expect([200, 404]).to.include(pm.response.code);
});
`
});

const deleteCategoryOne = makeRequest({
  name: 'Admin Delete Category 1',
  method: 'DELETE',
  endpoint: '/api/v1/categories/{{categoryOneId}}',
  headers: authHeader('adminAccessToken'),
  testScript: `
pm.test('Delete category 1 returns 200 or 404', function () {
  pm.expect([200, 404]).to.include(pm.response.code);
});
`
});

const deleteCategoryTwo = makeRequest({
  name: 'Admin Delete Category 2',
  method: 'DELETE',
  endpoint: '/api/v1/categories/{{categoryTwoId}}',
  headers: authHeader('adminAccessToken'),
  testScript: `
pm.test('Delete category 2 returns 200 or 404', function () {
  pm.expect([200, 404]).to.include(pm.response.code);
});
`
});

const smokeFolder = {
  name: 'Smoke',
  item: [
    initRequest,
    adminLogin,
    providerLogin,
    providerProfile,
    promoteProvider,
    providerRefreshRoleSync,
    providerProfileAfterSync,
    clientLogin,
    clientProfile,
    usersSnapshot,
    categoriesSnapshot,
    createCategoryOne,
    categoriesSnapshot,
    createServiceOne,
    servicesSnapshot,
    createBooking,
    bookingsSnapshotClient,
    providerLoginForLifecycle,
    refreshToken,
    logout,
    refreshAfterLogout
  ]
};

const e2eFolder = {
  name: 'E2E Flow',
  item: [
    initRequest,
    adminLogin,
    usersSnapshot,
    providerLogin,
    providerProfile,
    promoteProvider,
    providerRefreshRoleSync,
    providerProfileAfterSync,
    clientLogin,
    clientProfile,
    usersListNonAdmin,
    categoriesSnapshot,
    createCategoryOne,
    createCategoryTwo,
    categoriesSnapshot,
    getCategoryById,
    createServiceOne,
    createServiceTwo,
    servicesSnapshot,
    getServiceByIdAsClient,
    editServiceOne,
    createBooking,
    bookingsSnapshotClient,
    getAllBookingsClient,
    getProviderBookings,
    acceptBooking,
    completeBooking,
    providerLoginForLifecycle,
    refreshToken,
    logout,
    refreshAfterLogout,
    clientLogin,
    deleteBookingRequest,
    providerLogin,
    providerRefreshRoleSync,
    deleteServiceOne,
    deleteServiceTwo,
    adminLogin,
    deleteCategoryOne,
    deleteCategoryTwo
  ]
};

const negativeFolder = {
  name: 'Negative Cases',
  item: [
    initRequest,
    providerLogin,
    providerProfile,
    promoteProvider,
    providerRefreshRoleSync,
    clientLogin,
    clientProfile,
    categoriesSnapshot,
    noTokenProfile,
    clientForbiddenServiceCreate,
    nonAdminChangeRole,
    bookingStatusMissingBody
  ]
};

const collection = {
  info: {
    _postman_id: 'd7bb4fd7-11e0-4b4b-9221-3137eca5aa5d',
    name: 'Servify API Automation',
    description:
      'Credential-based Postman/Newman automation for Servify API with role-sync refresh and DB snapshot checks for users/categories/services/bookings.',
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
  },
  item: [smokeFolder, e2eFolder, negativeFolder],
  event: [
    {
      listen: 'prerequest',
      script: {
        type: 'text/javascript',
        exec: toExec(initDynamicDataScript)
      }
    }
  ],
  variable: [
    { key: 'runId', value: '' },
    { key: 'adminAccessToken', value: '' },
    { key: 'providerAccessToken', value: '' },
    { key: 'clientAccessToken', value: '' },
    { key: 'adminUserId', value: '' },
    { key: 'providerUserId', value: '' },
    { key: 'clientUserId', value: '' },
    { key: 'providerTokenRole', value: '' },
    { key: 'clientTokenRole', value: '' },
    { key: 'providerUserType', value: '' },
    { key: 'clientUserType', value: '' },
    { key: 'categoryOneId', value: '' },
    { key: 'categoryTwoId', value: '' },
    { key: 'serviceId', value: '' },
    { key: 'serviceTwoId', value: '' },
    { key: 'bookingId', value: '' },
    { key: 'usersCount', value: '' },
    { key: 'categoriesCount', value: '' },
    { key: 'servicesCount', value: '' },
    { key: 'allBookingsCount', value: '' },
    { key: 'clientBookingsCount', value: '' }
  ]
};

fs.writeFileSync(outputPath, JSON.stringify(collection, null, 2) + '\n', 'utf8');
console.log(`Collection generated: ${outputPath}`);
