'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './ContactForm.module.css';

export default function ContactForm() {
  const t = useTranslations('contact.form');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    website: '' // honeypot: humanos não veem, bots preenchem
  });

  // A API descarta envios feitos rápido demais após abrir a página (bots).
  const mountedAt = useRef(0);
  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
    mailtoLink?: string;
  }>({ type: null, message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, elapsedMs: Date.now() - mountedAt.current }),
      });

      const data = await response.json();
      // Fallback sem Resend: mostra o link mailto em vez de navegar para fora da página.
      const mailtoLink: string | undefined =
        data.useMailto && data.mailtoLink ? data.mailtoLink : undefined;

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: data.message || 'Mensagem enviada com sucesso!',
          mailtoLink,
        });

        // Com o link mailto na tela, mantém a mensagem e o formulário até o usuário agir.
        if (mailtoLink) return;

        // Reset form após 3 segundos
        setTimeout(() => {
          setFormData({
            name: '',
            email: '',
            subject: '',
            message: '',
            website: ''
          });
          setSubmitStatus({ type: null, message: '' });
        }, 3000);
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.error || 'Erro ao enviar mensagem. Tente novamente.',
          mailtoLink,
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Erro ao enviar mensagem. Tente novamente.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.formCard1}>
      <div className={styles.formCard2}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <p className={styles.formHeading}>{t('heading')}</p>
          
          {submitStatus.type && (
            <div className={`${styles.statusMessage} ${styles[submitStatus.type]}`}>
              {submitStatus.message}
              {submitStatus.mailtoLink && (
                <>
                  {' '}
                  <a href={submitStatus.mailtoLink} target="_blank" rel="noopener noreferrer">
                    {t('openEmail')}
                  </a>
                </>
              )}
            </div>
          )}

          <div className={styles.honeypot} aria-hidden="true">
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={formData.website}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formField}>
            <input
              required
              placeholder={t('name')}
              className={styles.inputField}
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
            />
          </div>
          <button 
            className={styles.sendMessageBtn} 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? t('sending') || 'Enviando...' : t('send')}
          </button>
        </form>
      </div>
    </div>
  );
}
