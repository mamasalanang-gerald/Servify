import houseCleaningImg from "../assets/images/house_cleaning.jpg";
import plumbingImg from "../assets/images/plumbing_repair.jpg";
import spaImg from "../assets/images/spa_massage.jpg";
import mathImg from "../assets/images/math_physics.jpg";
import computerRepairImg from "../assets/images/computer_repair.jpg";
import webDesignImg from "../assets/images/professional_web_design.png";

const services = [
  { id: 1, title: "Deep Home Cleaning", category: "Home Cleaning", provider: "Maria Santos", initials: "MS", jobs: "142 jobs completed", rating: 4.9, price: "$49", img: houseCleaningImg, reviewCount: 156, description: "Professional deep cleaning service for your entire home. Our team uses eco-friendly products and advanced cleaning techniques to ensure every corner sparkles. Perfect for move-ins, move-outs, or seasonal deep cleans." },
  { id: 2, title: "Pipe Repair & Installation", category: "Plumbing", provider: "Jake Rivera", initials: "JR", jobs: "98 jobs completed", rating: 4.7, price: "$79", img: plumbingImg, reviewCount: 89, description: "Expert plumbing repair and installation services. From leaky faucets to full pipe replacements, we handle it all with fast response times and quality workmanship." },
  { id: 3, title: "Full Body Spa Treatment", category: "Beauty & Spa", provider: "Lily Chen", initials: "LC", jobs: "210 jobs completed", rating: 5.0, price: "$89", img: spaImg, reviewCount: 210, description: "Indulge in a luxurious full body spa experience. Our certified therapists provide relaxing treatments tailored to your needs, using premium natural products." },
  { id: 4, title: "Math & Science Tutoring", category: "Tutoring", provider: "Dr. Amos", initials: "DA", jobs: "317 jobs completed", rating: 4.8, price: "$35", img: mathImg, reviewCount: 317, description: "Experienced PhD tutor specializing in high school and university level Math and Science. Personalized sessions that build real understanding and confidence." },
  { id: 5, title: "Appliance Repair", category: "Repairs", provider: "Tom Cruz", initials: "TC", jobs: "76 jobs completed", rating: 4.6, price: "$59", img: computerRepairImg, reviewCount: 76, description: "Fast, reliable appliance repair for all major brands. Washing machines, refrigerators, ovens, and more — diagnosed and fixed on the same day." },
  { id: 6, title: "Website Development", category: "Digital Services", provider: "Sia Reyes", initials: "SR", jobs: "183 jobs completed", rating: 4.9, price: "$120", img: webDesignImg, reviewCount: 183, description: "Full-stack web development tailored to your business. Modern, responsive, and SEO-optimized websites built with React, Next.js, and more." },
];

export default function ServicesGrid({ searchQuery, onSelectService }) {
  const filtered = services.filter((s) =>
    s.title.toLowerCase().includes((searchQuery || "").toLowerCase()) ||
    s.category.toLowerCase().includes((searchQuery || "").toLowerCase())
  );

  return (
    <div className="services-grid-wrapper">
      <p className="services-grid__count">{filtered.length} services found</p>
      <div className="services-grid">
        {filtered.length === 0 ? (
          <p className="services-grid__empty">No services match your search.</p>
        ) : (
          filtered.map((s) => (
            <div
              key={s.id}
              className="service-card"
              style={{ cursor: "pointer" }}
              onClick={() => onSelectService(s)}
            >
              <div className="service-card__img-wrapper">
                <img src={s.img} alt={s.title} className="service-card__img" />
                <span className="service-card__rating">⭐ {s.rating}</span>
                <span className="service-card__category">{s.category}</span>
              </div>
              <div className="service-card__body">
                <p className="service-card__title">{s.title}</p>
                <div className="service-card__provider">
                  <div className="service-card__provider-avatar">{s.initials}</div>
                  <div>
                    <p className="service-card__provider-name">{s.provider}</p>
                    <p className="service-card__jobs">{s.jobs}</p>
                  </div>
                </div>
                <div className="service-card__footer">
                  <div>
                    <p className="service-card__starting">Starting at</p>
                    <p className="service-card__price">{s.price}</p>
                  </div>
                  <button
                    className="service-card__btn"
                    onClick={(e) => { e.stopPropagation(); onSelectService(s); }}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}