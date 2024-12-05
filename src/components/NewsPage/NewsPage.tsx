import React from 'react';
import cl from '../../modules/NewsPage/NewsPage.module.css';

const NewsPage = () => {
    return (
        <div className={cl.container}>
            <div className={cl.leftColumn}>
            <div className={cl.imageBanner} style={{backgroundImage: `url(/NewsBannerImage.png)`}}>      
                <div className={cl.underSectionBanner}>June 12, 2024</div>
            </div>
                <h1>
                    Free Pediatric Check-Ups for <span className={cl.spanText}>New</span> Patients
                </h1>
                <p>We’re thrilled to announce a special opportunity for families!</p>
                <p>
                    At Health Rebalance, we are committed to ensuring your child’s health and well-being.
                    <br />
                    To help you get started, we’re offering FREE pediatric check-ups for all new patients.
                    <br />
                    This comprehensive check-up includes:
                </p>
                <ul>
                    <li>Growth and development assessment</li>
                    <li>Immunization review</li>
                    <li>Nutritional guidance</li>
                    <li>General health evaluation</li>
                    <li>Personalized care recommendations</li>
                </ul>
                <p>
                    Who is eligible?
                    <br />
                    All children who are visiting Health Rebalance for the first time are welcome to take advantage of this offer.
                    <br />
                    How to book?
                    <br />
                    It’s easy! Simply call us at insert phone number or book online through our website insert website link. Appointments are filling up fast, so don’t wait!
                    <br />
                    Let us help your child achieve optimal health. Together, we’ll build the foundation for a healthier future!
                </p>
                <p>Let us help your child achieve optimal health...</p>
            </div>

            <div className={cl.rightColumn}>
            <div className={cl.imageConteiner} style={{backgroundImage: `url(https://vedic-culture.in.ua/images/site/the-vedas/vedic-holidays/month-of-damodara/954-02-constellation-krittika-the-Pleiades.jpg)`}}>      
                <div className={cl.content}>
                    <span className={cl.date}>June 12, 2024</span>
                    <div className={cl.underSection}>Free Pediatric Check-Ups for <span className={cl.highlight}>New</span> Patients</div>
                </div>
            </div>
            <div className={cl.imageConteiner} style={{backgroundImage: `url(https://vedic-culture.in.ua/images/site/the-vedas/vedic-holidays/month-of-damodara/954-02-constellation-krittika-the-Pleiades.jpg)`}}>      
                <div className={cl.content}>
                    <span className={cl.date}>June 12, 2024</span>
                    <div className={cl.underSection}>Free Pediatric Check-Ups for <span className={cl.highlight}>New</span> Patients</div>
                </div>
            </div>
            <div className={cl.imageConteiner} style={{backgroundImage: `url(https://vedic-culture.in.ua/images/site/the-vedas/vedic-holidays/month-of-damodara/954-02-constellation-krittika-the-Pleiades.jpg)`}}>      
                <div className={cl.content}>
                    <span className={cl.date}>June 12, 2024</span>
                    <div className={cl.underSection}>Free Pediatric Check-Ups for <span className={cl.highlight}>New</span> Patients</div>
                </div>
            </div>
            <div className={cl.imageConteiner} style={{backgroundImage: `url(https://vedic-culture.in.ua/images/site/the-vedas/vedic-holidays/month-of-damodara/954-02-constellation-krittika-the-Pleiades.jpg)`}}>      
                <div className={cl.content}>
                    <span className={cl.date}>June 12, 2024</span>
                    <div className={cl.underSection}>Free Pediatric Check-Ups for <span className={cl.highlight}>New</span> Patients</div>
                </div>
            </div>
            <div className={cl.imageConteiner} style={{backgroundImage: `url(https://vedic-culture.in.ua/images/site/the-vedas/vedic-holidays/month-of-damodara/954-02-constellation-krittika-the-Pleiades.jpg)`}}>      
                <div className={cl.content}>
                    <span className={cl.date}>June 12, 2024</span>
                    <div className={cl.underSection}>Free Pediatric Check-Ups for <span className={cl.highlight}>New</span> Patients</div>
                </div>
            </div>
            </div>
        </div>
    );
};

export default NewsPage;