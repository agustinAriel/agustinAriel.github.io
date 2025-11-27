(function() {
    // 1. Funcionalidad de la Barra de Navegación (Scroll y Menú Burger)
    const nav = document.querySelector('.navbar');
    const burger = document.querySelector('.burger');
    const menu = document.querySelector('.navbar-menu');

    // a) Efecto de scroll para la barra de navegación
    const threshold = window.innerHeight * 0.10; // 10vh

    function checkScroll() {
        if (nav) {
            if (window.scrollY > threshold) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }
    }

    if (nav) {
        window.addEventListener('scroll', checkScroll, { passive: true });
        // Comprobar al cargar la página
        checkScroll();
    }

    // b) Menú hamburguesa (Burger menu)
    if (burger && nav) {
        burger.addEventListener('click', () => {
            const opened = nav.classList.toggle('open');
            burger.setAttribute('aria-expanded', opened ? 'true' : 'false');
        });

        // Cerrar el menú al hacer clic en un enlace (útil en móviles)
        menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
            nav.classList.remove('open');
            burger.setAttribute('aria-expanded', 'false');
        }));
    }


    // 2. Actualización automática del año en el Footer
    const yearElement = document.getElementById('year-footer');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    // 3. VALIDACIÓN DEL FORMULARIO
    const form = document.getElementById('contactForm');
    const formMessages = document.getElementById('formMessages');

    // Elementos del formulario
    const nombreInput = document.getElementById('nombre');
    const emailInput = document.getElementById('email');
    const telefonoInput = document.getElementById('telefono');
    const edadInput = document.getElementById('edad');
    const departamentoSelect = document.getElementById('departamento');
    const cepaSelect = document.getElementById('cepa');

    // Elementos de error
    const errorNombre = document.getElementById('errorNombre');
    const errorEmail = document.getElementById('errorEmail');
    const errorTelefono = document.getElementById('errorTelefono');
    const errorEdad = document.getElementById('errorEdad');
    const errorDepartamento = document.getElementById('errorDepartamento');
    const errorCepa = document.getElementById('errorCepa');

    // Expresiones regulares para validación
    const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/;
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexTelefono = /^(\+?54)?[\s\-]?9?[\s\-]?(11|2[0-9]{2,3}|3[0-9]{2,3})[\s\-]?[0-9]{3,4}[\s\-]?[0-9]{4}$/;

    // Función para mostrar mensaje general
    function mostrarMensaje(mensaje, tipo) {
        formMessages.textContent = mensaje;
        formMessages.className = 'form-messages show ' + tipo;
        
        // Scroll suave hacia el mensaje
        formMessages.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Auto-ocultar mensaje después de 5 segundos si es de éxito
        if (tipo === 'success') {
            setTimeout(() => {
                formMessages.classList.remove('show');
            }, 5000);
        }
    }

    // Función para mostrar error individual
    function mostrarError(elemento, mensaje, campo) {
        elemento.textContent = mensaje;
        campo.classList.add('invalid');
        campo.classList.remove('valid');
    }

    // Función para limpiar error individual
    function limpiarError(elemento, campo) {
        elemento.textContent = '';
        campo.classList.remove('invalid');
        if (campo.value.trim() !== '') {
            campo.classList.add('valid');
        }
    }

    // Validación en tiempo real para nombre
    nombreInput.addEventListener('input', function() {
        const valor = this.value.trim();
        
        if (valor === '') {
            mostrarError(errorNombre, 'El nombre es obligatorio', this);
        } else if (valor.length < 2) {
            mostrarError(errorNombre, 'El nombre debe tener al menos 2 caracteres', this);
        } else if (valor.length > 50) {
            mostrarError(errorNombre, 'El nombre no puede tener más de 50 caracteres', this);
        } else if (!regexNombre.test(valor)) {
            mostrarError(errorNombre, 'El nombre solo puede contener letras y espacios', this);
        } else {
            limpiarError(errorNombre, this);
        }
    });

    // Validación en tiempo real para email
    emailInput.addEventListener('input', function() {
        const valor = this.value.trim();
        
        if (valor === '') {
            mostrarError(errorEmail, 'El email es obligatorio', this);
        } else if (!regexEmail.test(valor)) {
            mostrarError(errorEmail, 'Por favor, ingresa un email válido (ejemplo: usuario@dominio.com)', this);
        } else {
            limpiarError(errorEmail, this);
        }
    });

    // Validación en tiempo real para teléfono (opcional pero si se completa debe ser válido)
    telefonoInput.addEventListener('input', function() {
        const valor = this.value.trim();
        
        if (valor !== '' && !regexTelefono.test(valor)) {
            mostrarError(errorTelefono, 'Formato de teléfono argentino inválido', this);
        } else {
            limpiarError(errorTelefono, this);
        }
    });

    // Validación en tiempo real para edad
    edadInput.addEventListener('input', function() {
        const valor = parseInt(this.value);
        
        if (this.value === '') {
            mostrarError(errorEdad, 'La edad es obligatoria', this);
        } else if (isNaN(valor)) {
            mostrarError(errorEdad, 'Por favor, ingresa un número válido', this);
        } else if (valor < 18) {
            mostrarError(errorEdad, 'Debes ser mayor de 18 años para participar 🍷', this);
        } else if (valor > 120) {
            mostrarError(errorEdad, 'Por favor, ingresa una edad válida', this);
        } else {
            limpiarError(errorEdad, this);
        }
    });

    // Validación para departamento
    departamentoSelect.addEventListener('change', function() {
        if (this.value === '') {
            mostrarError(errorDepartamento, 'Debes seleccionar un departamento', this);
        } else {
            limpiarError(errorDepartamento, this);
        }
    });

    // Validación para cepa
    cepaSelect.addEventListener('change', function() {
        if (this.value === '') {
            mostrarError(errorCepa, 'Debes seleccionar una cepa', this);
        } else {
            limpiarError(errorCepa, this);
        }
    });

    // Validación al enviar el formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let formValido = true;

        // Validar nombre
        const nombre = nombreInput.value.trim();
        if (nombre === '') {
            mostrarError(errorNombre, 'El nombre es obligatorio', nombreInput);
            formValido = false;
        } else if (!regexNombre.test(nombre)) {
            mostrarError(errorNombre, 'El nombre solo puede contener letras y espacios', nombreInput);
            formValido = false;
        } else {
            limpiarError(errorNombre, nombreInput);
        }

        // Validar email
        const email = emailInput.value.trim();
        if (email === '') {
            mostrarError(errorEmail, 'El email es obligatorio', emailInput);
            formValido = false;
        } else if (!regexEmail.test(email)) {
            mostrarError(errorEmail, 'Por favor, ingresa un email válido', emailInput);
            formValido = false;
        } else {
            limpiarError(errorEmail, emailInput);
        }

        // Validar teléfono (opcional)
        const telefono = telefonoInput.value.trim();
        if (telefono !== '' && !regexTelefono.test(telefono)) {
            mostrarError(errorTelefono, 'Formato de teléfono argentino inválido', telefonoInput);
            formValido = false;
        } else {
            limpiarError(errorTelefono, telefonoInput);
        }

        // Validar edad
        const edad = parseInt(edadInput.value);
        if (isNaN(edad) || edad < 18 || edad > 120) {
            if (edad < 18) {
                mostrarError(errorEdad, 'Debes ser mayor de 18 años para participar 🍷', edadInput);
            } else {
                mostrarError(errorEdad, 'Por favor, ingresa una edad válida', edadInput);
            }
            formValido = false;
        } else {
            limpiarError(errorEdad, edadInput);
        }

        // Validar departamento
        if (departamentoSelect.value === '') {
            mostrarError(errorDepartamento, 'Debes seleccionar un departamento', departamentoSelect);
            formValido = false;
        } else {
            limpiarError(errorDepartamento, departamentoSelect);
        }

        // Validar cepa
        if (cepaSelect.value === '') {
            mostrarError(errorCepa, 'Debes seleccionar una cepa', cepaSelect);
            formValido = false;
        } else {
            limpiarError(errorCepa, cepaSelect);
        }

        // Si el formulario es válido
        if (formValido) {
            // Obtener el nombre del departamento seleccionado
            const departamentoTexto = departamentoSelect.options[departamentoSelect.selectedIndex].text;
            const cepaTexto = cepaSelect.options[cepaSelect.selectedIndex].text;
            
            mostrarMensaje(
                `¡Mensaje enviado con éxito! 🍷✨ Gracias ${nombre} por compartir tus preferencias. Te contactaremos pronto con información sobre ${cepaTexto} de ${departamentoTexto}. ¡Salud!`,
                'success'
            );

            // Limpiar el formulario después de 2 segundos
            setTimeout(() => {
                form.reset();
                // Limpiar clases de validación
                document.querySelectorAll('.valid').forEach(el => el.classList.remove('valid'));
            }, 2000);

            // Aquí podrías agregar código para enviar los datos a un servidor
            console.log('Datos del formulario:', {
                nombre,
                email,
                telefono,
                edad,
                departamento: departamentoSelect.value,
                cepa: cepaSelect.value
            });
        } else {
            mostrarMensaje('Por favor, corrige los errores en el formulario antes de enviar.', 'error');
        }
    });
})();
