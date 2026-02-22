import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const days      = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const timeSlots = ['7:00 AM','8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM'];

const ProviderProfile = () => {
  const [activeTab, setActiveTab] = useState('Profile');
  const [saved, setSaved]         = useState(false);
  const [skills, setSkills]       = useState(['House Cleaning', 'Deep Cleaning', 'Post-Construction', 'Eco-Friendly Products']);
  const [newSkill, setNewSkill]   = useState('');
  const [form, setForm]           = useState({
    name: 'Juan dela Cruz',
    bio: 'Professional cleaner with 5+ years of experience. Specializing in deep cleaning, move-in/out cleans, and eco-friendly solutions. Serving Metro Manila and nearby areas.',
    phone: '+63 912 345 6789',
    email: 'juan.delacruz@email.com',
    address: 'Quezon City, Metro Manila',
    experience: '5 years',
  });
  const [availability, setAvailability] = useState({
    Monday:    { open: true,  start: '8:00 AM', end: '5:00 PM' },
    Tuesday:   { open: true,  start: '8:00 AM', end: '5:00 PM' },
    Wednesday: { open: true,  start: '8:00 AM', end: '5:00 PM' },
    Thursday:  { open: true,  start: '8:00 AM', end: '5:00 PM' },
    Friday:    { open: true,  start: '8:00 AM', end: '5:00 PM' },
    Saturday:  { open: true,  start: '9:00 AM', end: '3:00 PM' },
    Sunday:    { open: false, start: '9:00 AM', end: '3:00 PM' },
  });

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };
  const addSkill   = () => { if (newSkill.trim()) { setSkills([...skills, newSkill.trim()]); setNewSkill(''); } };
  const removeSkill = (i) => setSkills(skills.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        {['Profile', 'Availability'].map((t) => (
          <button
            key={t}
            className={`px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === t
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
            onClick={() => setActiveTab(t)}
          >
            {t}
            {activeTab === t && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
            )}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {activeTab === 'Profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic info */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                    <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Years of Experience</label>
                    <Input value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Bio / About Me</label>
                  <textarea 
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={form.bio} 
                    onChange={(e) => setForm({ ...form, bio: e.target.value })} 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                    <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                    <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Service Area / Address</label>
                  <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Skills & Specializations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {skills.map((s, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                      {s}
                      <button 
                        className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 transition-colors" 
                        onClick={() => removeSkill(i)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a skill..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                  />
                  <Button variant="outline" onClick={addSkill}>Add</Button>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center gap-4">
              <Button onClick={handleSave}>
                {saved ? '✓ Saved!' : 'Save Changes'}
              </Button>
              {saved && <span className="text-sm text-green-600 dark:text-green-400">Profile updated successfully.</span>}
            </div>
          </div>

          {/* Right: avatar + stats */}
          <div className="space-y-6">
            <Card>
              <CardContent className="flex flex-col items-center p-6">
                <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300 text-2xl font-bold mb-4">
                  JD
                </div>
                <div className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">{form.name}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">Service Provider · {form.experience}</div>
                <Button variant="outline" className="w-full">Change Photo</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profile Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: 'Completed Jobs', value: '84' },
                  { label: 'Response Rate',  value: '98%' },
                  { label: 'Repeat Clients', value: '34' },
                  { label: 'Member Since',   value: 'Mar 2021' },
                ].map((s) => (
                  <div key={s.label} className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{s.label}</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{s.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Availability tab */}
      {activeTab === 'Availability' && (
        <Card>
          <CardHeader>
            <CardTitle>Weekly Availability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {days.map((day) => {
              const av = availability[day];
              return (
                <div key={day} className="flex items-center gap-4 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={av.open} 
                      onChange={() => setAvailability({ ...availability, [day]: { ...av, open: !av.open } })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                  <span className={`min-w-[100px] text-sm font-medium ${av.open ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-500'}`}>
                    {day}
                  </span>
                  {av.open ? (
                    <div className="flex items-center gap-3 flex-1">
                      <Select value={av.start} onValueChange={(value) => setAvailability({ ...availability, [day]: { ...av, start: value } })}>
                        <SelectTrigger className="w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((t) => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <span className="text-sm text-gray-600 dark:text-gray-400">to</span>
                      <Select value={av.end} onValueChange={(value) => setAvailability({ ...availability, [day]: { ...av, end: value } })}>
                        <SelectTrigger className="w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((t) => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500 dark:text-gray-500">Day off</span>
                  )}
                </div>
              );
            })}
            <div className="pt-4">
              <Button onClick={handleSave}>
                {saved ? '✓ Saved!' : 'Save Availability'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProviderProfile;
