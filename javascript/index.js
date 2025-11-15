(function(){
      // Preloader
      const preloader = document.getElementById('preloader');
      const progressFill = document.getElementById('progress-fill');
      
      // Simulare progres
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          clearInterval(progressInterval);
          setTimeout(() => {
            preloader.classList.add('hidden');
          }, 500);
        }
        progressFill.style.width = progress + '%';
      }, 200);

      // Logica de animație la scroll
      const items = document.querySelectorAll('[data-motion]');
      const onScroll = () => {
        const h = window.innerHeight;
        items.forEach(el => {
          if(el.classList.contains('visible')) return;
          const r = el.getBoundingClientRect();
          if(r.top < h - 60){
            el.classList.add('visible');
          }
        });
      };
      
      window.addEventListener('scroll', onScroll);
      window.addEventListener('load', onScroll);
      
      // Centralizarea funcției de deschidere modal
      const openModal = (modalId) => {
          const modal = document.getElementById(modalId);
          if (modal) {
              modal.classList.add('active');
              document.body.style.overflow = 'hidden';
          }
      };

      // Centralizarea funcției de închidere modal
      const closeModal = (modal) => {
        modal.classList.remove('active');
        if (document.querySelectorAll('.modal.active').length === 0) {
            document.body.style.overflow = 'auto';
        }
      };

      // Funcționalitate Formular (Acum deschide modalul de succes)
      document.getElementById('contactForm').addEventListener('submit', e => {
        e.preventDefault();
        const contactModal = document.getElementById('contact-modal');
        
        // Simulare trimitere (aici ar fi logica AJAX/Fetch către server)
        
        closeModal(contactModal); // Închide modalul de contact
        openModal('success-modal');

        e.target.reset(); // Curăță formularul după trimitere
      });

      // Funcționalitate Modal pentru link-uri (din navbar/hero)
      document.querySelectorAll('[data-modal-open]').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault(); 
          const modalId = link.getAttribute('data-modal-open');
          openModal(modalId);
          
          // Închide meniul mobil dacă este deschis
          if (window.innerWidth <= 768) {
              document.querySelector('nav').classList.remove('open');
              document.querySelector('.menu-toggle').setAttribute('aria-expanded', 'false');
              document.body.style.overflowY = 'auto'; 
          }
        });
      });
      
      // Logica de închidere modal
      const modals = document.querySelectorAll('.modal');
      
      // Închidere la click pe butonul de închidere
      document.querySelectorAll('.modal-close').forEach(button => {
        button.addEventListener('click', () => {
          const modal = button.closest('.modal');
          closeModal(modal);
        });
      });
      
      // Închidere la click în afara modalului (pe overlay)
      modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            closeModal(modal);
          }
        });
      });
      
      // Închidere la apăsarea tastei ESC
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          modals.forEach(modal => {
            if (modal.classList.contains('active')) {
                closeModal(modal);
            }
          });
        }
      });
      
      // Funcționalitate Meniu Hamburger (Mobile)
      const menuToggle = document.querySelector('.menu-toggle');
      const nav = document.querySelector('nav');
      
      if (menuToggle) {
        menuToggle.addEventListener('click', () => {
          const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
          const willOpen = !isExpanded;
          
          menuToggle.setAttribute('aria-expanded', willOpen);
          nav.classList.toggle('open');
          
          // Blochează scroll-ul paginii când meniul este deschis pe mobil
          if (window.innerWidth <= 768) {
              document.body.style.overflowY = willOpen ? 'hidden' : 'auto';
          }
        });
        
        // Închide meniul mobil când se dă click pe link-urile ancore sau modale
        document.querySelectorAll('.nav-item a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768 && nav.classList.contains('open')) {
                    // Timeout pentru a permite modalului să se deschidă (dacă e cazul)
                    setTimeout(() => {
                        nav.classList.remove('open');
                        menuToggle.setAttribute('aria-expanded', 'false');
                        // Permitem scroll-ul doar dacă nu s-a deschis un modal
                        if (document.querySelectorAll('.modal.active').length === 0) {
                             document.body.style.overflowY = 'auto';
                        }
                    }, 100); 
                }
            });
        });
      }

      // NOU: Funcționalitate FAQ
      const faqQuestions = document.querySelectorAll('.faq-question');
      faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
          const answer = question.nextElementSibling;
          const isActive = question.classList.contains('active');
          
          // Închide toate răspunsurile
          faqQuestions.forEach(q => {
            q.classList.remove('active');
            q.nextElementSibling.classList.remove('active');
          });
          
          // Deschide răspunsul curent dacă nu era activ
          if (!isActive) {
            question.classList.add('active');
            answer.classList.add('active');
          }
        });
      });

      // NOU: Calculator Preț
      const projectType = document.getElementById('project-type');
      const pages = document.getElementById('pages');
      const pagesValue = document.getElementById('pages-value');
      const features = document.getElementById('features');
      const estimatedPrice = document.getElementById('estimated-price');

      function updatePrice() {
        const basePrice = parseInt(projectType.value);
        const pagesCount = parseInt(pages.value);
        const featuresPrice = parseInt(features.value);
        
        // Calcul preț final
        let finalPrice = basePrice + featuresPrice;
        
        // Adaugă cost pentru pagini suplimentare (peste 10)
        if (pagesCount > 10) {
          finalPrice += (pagesCount - 10) * 50;
        }
        
        estimatedPrice.textContent = finalPrice + '€';
      }

      pages.addEventListener('input', function() {
        pagesValue.textContent = this.value + ' pagini';
        updatePrice();
      });

      projectType.addEventListener('change', updatePrice);
      features.addEventListener('change', updatePrice);

      // Inițializează prețul
      updatePrice();

      // NOU: Exit Intent Popup
      const exitPopup = document.getElementById('exit-popup');
      let mouseOutTriggered = false;

      document.addEventListener('mouseout', function(e) {
        if (!mouseOutTriggered && e.clientY < 0) {
          setTimeout(() => {
            exitPopup.classList.add('active');
            document.body.style.overflow = 'hidden';
          }, 1000);
          mouseOutTriggered = true;
        }
      });

      window.closePopup = function() {
        exitPopup.classList.remove('active');
        document.body.style.overflow = 'auto';
      };

      document.getElementById('popup-form').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Mulțumim! Vei primi ghidul în scurt timp.');
        closePopup();
      });

      // NOU: Tracking simplu
      const trackEvent = (category, action, label) => {
        console.log('Tracking:', category, action, label);
        // Aici s-ar integra Google Analytics sau alt sistem
      };

      // Track butoane importante
      document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('click', function() {
          trackEvent('Conversie', 'Click Buton', this.textContent);
        });
      });

      // Track formular
      document.getElementById('contactForm').addEventListener('submit', function() {
        trackEvent('Conversie', 'Formular Trimis', 'Contact');
      });

      // NOU: Funcționalitate pentru deschiderea articolelor în modal
      document.querySelectorAll('.read-more[data-article-id]').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const articleId = parseInt(link.getAttribute('data-article-id'), 10);
          const article = articles.find(a => a.id === articleId);

          if (article) {
            document.getElementById('article-category').textContent = article.category;
            document.getElementById('article-title').textContent = article.title;
            document.getElementById('article-content').innerHTML = article.content;
            openModal('article-modal');
          } else {
            console.error('Articolul nu a fost găsit:', articleId);
          }
        });
      });


    })();

    // NOU: Funcție pentru download raport (simulat)
    function downloadProjectReport() {
      alert('Raportul proiectului va fi descărcat. În versiunea reală, aceasta ar genera un PDF.');
      trackEvent('Dashboard', 'Download Raport', 'Proiect');
    }

    // NOU: Funcție pentru contact manager proiect
    function contactProjectManager() {
      alert('Te vom conecta cu managerul tău de proiect în cel mai scurt timp.');
      trackEvent('Dashboard', 'Contact Manager', 'Proiect');
    }