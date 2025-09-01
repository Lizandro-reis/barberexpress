// Dados simulados do sistema
const DATA = {
    services: [
        {
            id: 1,
            name: 'Corte Tradicional',
            description: 'Corte clássico masculino com acabamento profissional',
            price: 35.00,
            duration: 45
        },
        {
            id: 2,
            name: 'Corte + Barba',
            description: 'Corte completo com aparação e desenho da barba',
            price: 55.00,
            duration: 60
        },
        {
            id: 3,
            name: 'Barba Completa',
            description: 'Aparação, desenho e hidratação da barba',
            price: 25.00,
            duration: 30
        },
        {
            id: 4,
            name: 'Corte Moderno',
            description: 'Cortes modernos e estilizados',
            price: 45.00,
            duration: 50
        },
        {
            id: 5,
            name: 'Sobrancelha',
            description: 'Design e aparação de sobrancelhas masculinas',
            price: 15.00,
            duration: 20
        },
        {
            id: 6,
            name: 'Pacote Completo',
            description: 'Corte + Barba + Sobrancelha + Lavagem',
            price: 75.00,
            duration: 90
        }
    ],
    
    barbers: [
        {
            id: 1,
            name: 'Carlos Silva',
            specialty: 'Especialista em cortes clássicos',
            rating: 4.9,
            image: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=300',
            experience: '8 anos de experiência'
        },
        {
            id: 2,
            name: 'João Santos',
            specialty: 'Expert em cortes modernos e barba',
            rating: 4.8,
            image: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=300',
            experience: '6 anos de experiência'
        },
        {
            id: 3,
            name: 'Pedro Costa',
            specialty: 'Especialista em barbas e bigodes',
            rating: 4.7,
            image: 'https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=300',
            experience: '10 anos de experiência'
        },
        {
            id: 4,
            name: 'Ricardo Oliveira',
            specialty: 'Cortes infantis e adultos',
            rating: 4.6,
            image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=300',
            experience: '5 anos de experiência'
        }
    ],
    
    timeSlots: [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
        '17:00', '17:30', '18:00', '18:30'
    ],
    
    unavailableSlots: {
        '2025-01-20': ['09:00', '10:00', '15:30'],
        '2025-01-21': ['11:00', '14:00', '16:00'],
        '2025-01-22': ['09:30', '10:30', '17:00']
    }
};

// Função para obter dados
function getServices() {
    return DATA.services;
}

function getBarbers() {
    return DATA.barbers;
}

function getTimeSlots() {
    return DATA.timeSlots;
}

function getUnavailableSlots(date) {
    return DATA.unavailableSlots[date] || [];
}

// Formatação de moeda
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Formatação de tempo
function formatDuration(minutes) {
    if (minutes < 60) {
        return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
}