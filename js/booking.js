// Sistema de agendamento
class BookingSystem {
    constructor(authSystem) {
        this.authSystem = authSystem;
        this.currentBooking = {
            service: null,
            barber: null,
            date: null,
            time: null
        };
        this.currentStep = 1;
        this.init();
    }
    
    init() {
        this.bindEvents();
    }
    
    bindEvents() {
        // CTA Button
        document.getElementById('ctaBtn').addEventListener('click', () => {
            this.openBookingModal();
        });
        
        // Booking modal close
        document.getElementById('bookingClose').addEventListener('click', () => {
            this.closeBookingModal();
        });
        
        // Close modal on outside click
        document.addEventListener('click', (e) => {
            if (e.target.id === 'bookingModal') {
                this.closeBookingModal();
            }
        });
    }
    
    openBookingModal() {
        if (!this.authSystem.isLoggedIn()) {
            this.authSystem.showMessage('Faça login para agendar um serviço', 'warning');
            this.authSystem.openModal('loginModal');
            return;
        }
        
        this.resetBooking();
        this.showStep(1);
        document.getElementById('bookingModal').classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeBookingModal() {
        document.getElementById('bookingModal').classList.remove('active');
        document.body.style.overflow = 'auto';
        this.resetBooking();
    }
    
    resetBooking() {
        this.currentBooking = {
            service: null,
            barber: null,
            date: null,
            time: null
        };
        this.currentStep = 1;
    }
    
    showStep(step) {
        this.currentStep = step;
        this.updateStepIndicators();
        this.renderStepContent();
    }
    
    updateStepIndicators() {
        const steps = document.querySelectorAll('.step');
        steps.forEach((step, index) => {
            if (index + 1 <= this.currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }
    
    renderStepContent() {
        const content = document.getElementById('bookingContent');
        
        switch (this.currentStep) {
            case 1:
                this.renderServicesStep(content);
                break;
            case 2:
                this.renderBarbersStep(content);
                break;
            case 3:
                this.renderDateTimeStep(content);
                break;
            case 4:
                this.renderConfirmationStep(content);
                break;
        }
    }
    
    renderServicesStep(container) {
        const services = getServices();
        
        container.innerHTML = `
            <div class="booking-step active">
                <h3 class="mb-4">Escolha o serviço</h3>
                <div class="services-list">
                    ${services.map(service => `
                        <div class="service-option" data-service-id="${service.id}">
                            <div style="display: flex; justify-content: space-between; align-items: start;">
                                <div>
                                    <h4 style="font-weight: 600; margin-bottom: 8px;">${service.name}</h4>
                                    <p style="color: var(--primary-600); margin-bottom: 8px;">${service.description}</p>
                                    <small style="color: var(--primary-500);">${formatDuration(service.duration)}</small>
                                </div>
                                <div style="text-align: right;">
                                    <div class="service-price">${formatCurrency(service.price)}</div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="booking-nav">
                    <div></div>
                    <button class="btn-primary" id="nextStep1" disabled>Próximo</button>
                </div>
            </div>
        `;
        
        // Bind service selection
        const serviceOptions = container.querySelectorAll('.service-option');
        const nextBtn = container.querySelector('#nextStep1');
        
        serviceOptions.forEach(option => {
            option.addEventListener('click', () => {
                serviceOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                
                const serviceId = parseInt(option.dataset.serviceId);
                this.currentBooking.service = services.find(s => s.id === serviceId);
                nextBtn.disabled = false;
            });
        });
        
        nextBtn.addEventListener('click', () => {
            this.showStep(2);
        });
    }
    
    renderBarbersStep(container) {
        const barbers = getBarbers();
        
        container.innerHTML = `
            <div class="booking-step active">
                <h3 class="mb-4">Escolha o barbeiro</h3>
                <div class="barbers-list">
                    ${barbers.map(barber => `
                        <div class="barber-option" data-barber-id="${barber.id}">
                            <div style="display: flex; gap: 16px; align-items: center;">
                                <img src="${barber.image}" alt="${barber.name}" 
                                     style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover;">
                                <div>
                                    <h4 style="font-weight: 600; margin-bottom: 4px;">${barber.name}</h4>
                                    <p style="color: var(--primary-600); margin-bottom: 4px;">${barber.specialty}</p>
                                    <div style="color: var(--accent-500); font-weight: 500;">
                                        ⭐ ${barber.rating} • ${barber.experience}
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="booking-nav">
                    <button class="btn-back" id="backStep2">Voltar</button>
                    <button class="btn-primary" id="nextStep2" disabled>Próximo</button>
                </div>
            </div>
        `;
        
        // Bind barber selection
        const barberOptions = container.querySelectorAll('.barber-option');
        const nextBtn = container.querySelector('#nextStep2');
        const backBtn = container.querySelector('#backStep2');
        
        barberOptions.forEach(option => {
            option.addEventListener('click', () => {
                barberOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                
                const barberId = parseInt(option.dataset.barberId);
                this.currentBooking.barber = barbers.find(b => b.id === barberId);
                nextBtn.disabled = false;
            });
        });
        
        nextBtn.addEventListener('click', () => {
            this.showStep(3);
        });
        
        backBtn.addEventListener('click', () => {
            this.showStep(1);
        });
    }
    
    renderDateTimeStep(container) {
        container.innerHTML = `
            <div class="booking-step active">
                <h3 class="mb-4">Escolha data e horário</h3>
                
                <div style="margin-bottom: 24px;">
                    <h4 style="margin-bottom: 16px; font-weight: 600;">Data</h4>
                    <div class="calendar" id="bookingCalendar">
                        <div class="calendar-header">
                            <button class="calendar-nav" id="prevMonth">‹</button>
                            <h4 id="currentMonth">Janeiro 2025</h4>
                            <button class="calendar-nav" id="nextMonth">›</button>
                        </div>
                    </div>
                </div>
                
                <div id="timeSlotContainer" style="display: none;">
                    <h4 style="margin-bottom: 16px; font-weight: 600;">Horário disponível</h4>
                    <div class="time-slots" id="timeSlots"></div>
                </div>
                
                <div class="booking-nav">
                    <button class="btn-back" id="backStep3">Voltar</button>
                    <button class="btn-primary" id="nextStep3" disabled>Próximo</button>
                </div>
            </div>
        `;
        
        this.renderCalendar();
        
        const nextBtn = container.querySelector('#nextStep3');
        const backBtn = container.querySelector('#backStep3');
        
        nextBtn.addEventListener('click', () => {
            this.showStep(4);
        });
        
        backBtn.addEventListener('click', () => {
            this.showStep(2);
        });
    }
    
    renderCalendar() {
        const calendar = document.getElementById('bookingCalendar');
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        // Generate calendar days
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        let calendarHTML = '';
        
        // Day headers
        const dayHeaders = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        dayHeaders.forEach(day => {
            calendarHTML += `<div style="text-align: center; font-weight: 600; padding: 8px; color: var(--primary-600);">${day}</div>`;
        });
        
        // Calendar days
        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            const isCurrentMonth = date.getMonth() === month;
            const isToday = date.toDateString() === currentDate.toDateString();
            const isPast = date < currentDate;
            const dateStr = date.toISOString().split('T')[0];
            
            let classes = 'calendar-day';
            if (!isCurrentMonth) classes += ' other-month';
            if (isToday) classes += ' today';
            if (isPast) classes += ' past';
            
            calendarHTML += `
                <div class="${classes}" data-date="${dateStr}" 
                     style="${isPast ? 'opacity: 0.3; cursor: not-allowed;' : ''}">
                    ${date.getDate()}
                </div>
            `;
        }
        
        calendar.innerHTML = calendar.innerHTML.split('</div>')[0] + '</div>' + calendarHTML;
        
        // Bind calendar events
        const calendarDays = calendar.querySelectorAll('.calendar-day:not(.past)');
        calendarDays.forEach(day => {
            day.addEventListener('click', () => {
                if (day.classList.contains('past')) return;
                
                calendarDays.forEach(d => d.classList.remove('selected'));
                day.classList.add('selected');
                
                this.currentBooking.date = day.dataset.date;
                this.renderTimeSlots(day.dataset.date);
                
                document.getElementById('timeSlotContainer').style.display = 'block';
            });
        });
    }
    
    renderTimeSlots(date) {
        const timeSlots = getTimeSlots();
        const unavailable = getUnavailableSlots(date);
        const container = document.getElementById('timeSlots');
        
        container.innerHTML = timeSlots.map(time => {
            const isUnavailable = unavailable.includes(time);
            return `
                <div class="time-slot ${isUnavailable ? 'unavailable' : ''}" 
                     data-time="${time}"
                     ${isUnavailable ? 'style="pointer-events: none;"' : ''}>
                    ${time}
                </div>
            `;
        }).join('');
        
        // Bind time slot selection
        const slots = container.querySelectorAll('.time-slot:not(.unavailable)');
        const nextBtn = document.querySelector('#nextStep3');
        
        slots.forEach(slot => {
            slot.addEventListener('click', () => {
                slots.forEach(s => s.classList.remove('selected'));
                slot.classList.add('selected');
                
                this.currentBooking.time = slot.dataset.time;
                nextBtn.disabled = false;
            });
        });
    }
    
    renderConfirmationStep(container) {
        const { service, barber, date, time } = this.currentBooking;
        const formattedDate = new Date(date).toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        container.innerHTML = `
            <div class="booking-step active">
                <h3 class="mb-4">Confirmar agendamento</h3>
                
                <div class="booking-summary">
                    <div class="summary-item">
                        <span>Serviço:</span>
                        <span>${service.name}</span>
                    </div>
                    <div class="summary-item">
                        <span>Barbeiro:</span>
                        <span>${barber.name}</span>
                    </div>
                    <div class="summary-item">
                        <span>Data:</span>
                        <span>${formattedDate}</span>
                    </div>
                    <div class="summary-item">
                        <span>Horário:</span>
                        <span>${time}</span>
                    </div>
                    <div class="summary-item">
                        <span>Duração:</span>
                        <span>${formatDuration(service.duration)}</span>
                    </div>
                    <div class="summary-item">
                        <span>Total:</span>
                        <span>${formatCurrency(service.price)}</span>
                    </div>
                </div>
                
                <div class="booking-nav">
                    <button class="btn-back" id="backStep4">Voltar</button>
                    <button class="btn-primary" id="confirmBooking">Confirmar Agendamento</button>
                </div>
            </div>
        `;
        
        const backBtn = container.querySelector('#backStep4');
        const confirmBtn = container.querySelector('#confirmBooking');
        
        backBtn.addEventListener('click', () => {
            this.showStep(3);
        });
        
        confirmBtn.addEventListener('click', () => {
            this.confirmBooking();
        });
    }
    
    confirmBooking() {
        // Simulate booking confirmation
        const bookingId = Date.now();
        const booking = {
            id: bookingId,
            ...this.currentBooking,
            user: this.authSystem.getCurrentUser(),
            status: 'confirmado',
            createdAt: new Date()
        };
        
        // Save booking (simulate with localStorage)
        const existingBookings = JSON.parse(localStorage.getItem('barberExpressBookings') || '[]');
        existingBookings.push(booking);
        localStorage.setItem('barberExpressBookings', JSON.stringify(existingBookings));
        
        this.closeBookingModal();
        this.authSystem.showMessage('Agendamento confirmado com sucesso!', 'success');
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
            this.authSystem.showDashboard();
        }, 2000);
    }
}