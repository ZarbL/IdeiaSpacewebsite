'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './ContactForm.module.css';

export default function ContactForm() {
  const t = useTranslations('contact.form');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct mailto link
    const mailtoLink = `mailto:contato@ideiaspace.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
      `Nome: ${formData.name}\nEmail: ${formData.email}\n\nMensagem:\n${formData.message}`
    )}`;
    
    window.location.href = mailtoLink;
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className={styles.formCard1}>
      <div className={styles.formCard2}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <p className={styles.formHeading}>{t('heading')}</p>
          <div className={styles.formField}>
            <input
              required
              placeholder={t('name')}
              className={styles.inputField}
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formField}>
            <input
              required
              placeholder={t('email')}
              className={styles.inputField}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formField}>
            <input
              required
              placeholder={t('subject')}
              className={styles.inputField}
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formField}>
            <textarea
              required
              placeholder={t('message')}
              cols={30}
              rows={3}
              className={styles.inputField}
              name="message"
              value={formData.message}
              onChange={handleChange}
            />
          </div>
          <button className={styles.sendMessageBtn} type="submit">
            {t('send')}
          </button>
        </form>
      </div>
    </div>
  );
}
