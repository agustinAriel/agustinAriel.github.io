document.addEventListener('DOMContentLoaded', () => {
    // Manejo del menú móvil
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Cerrar el menú móvil al hacer clic en un enlace
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // Lógica de la sección de Promoción
    const montoInput = document.getElementById('monto-veterinaria');
    const calcularPremioBtn = document.getElementById('calcular-premio');
    const resultadoPremioDiv = document.getElementById('resultado-premio');

    if (montoInput && calcularPremioBtn && resultadoPremioDiv) {
        calcularPremioBtn.addEventListener('click', () => {
            const monto = parseFloat(montoInput.value);

            if (isNaN(monto) || monto <= 0) {
                resultadoPremioDiv.textContent = 'Por favor, ingresa un monto válido.';
                resultadoPremioDiv.classList.remove('hidden');
                return;
            }

            let premio = '';
            if (monto >= 10000) {
                premio = '¡Felicidades! Has ganado un Paseo Grupal GRATIS.';
            } else if (monto >= 5000) {
                premio = '¡Excelente! Tienes un 20% de descuento en tu próximo Paseo Individual.';
            } else if (monto >= 2000) {
                premio = '¡Genial! Disfruta de un 10% de descuento en cualquier servicio.';
            } else {
                premio = 'Sigue sumando para ganar un premio. ¡Gracias por tu compra!';
            }

            resultadoPremioDiv.textContent = premio;
            resultadoPremioDiv.classList.remove('hidden');
        });
    }

    // Suavizado del scroll para los enlaces de navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
