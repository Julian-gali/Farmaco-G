/**
 * Script Principal - Vademécum Digital Oftálmico
 */

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initSidebarNavigation();
    initFavoriteButtons();
    initSearchInteraction();
    
    // Iniciar el renderizado del catálogo si existe la función
    if(typeof renderMedicamentos === 'function') {
        renderMedicamentos('todos', null);
    }
});

function initThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;
    const themeIcon = themeToggleBtn.querySelector('i');
    const savedTheme = localStorage.getItem('vademecum-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.body.setAttribute('data-theme', 'dark');
        themeIcon.classList.replace('ph-moon', 'ph-sun');
    }

    themeToggleBtn.addEventListener('click', () => {
        themeIcon.style.transform = 'rotate(180deg)';
        setTimeout(() => themeIcon.style.transform = 'none', 300);

        if (document.body.getAttribute('data-theme') === 'dark') {
            document.body.removeAttribute('data-theme');
            localStorage.setItem('vademecum-theme', 'light');
            themeIcon.classList.replace('ph-sun', 'ph-moon');
        } else {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('vademecum-theme', 'dark');
            themeIcon.classList.replace('ph-moon', 'ph-sun');
        }
    });
}

function initSidebarNavigation() {
    const navItems = document.querySelectorAll('.sidebar-nav li a');
    const viewSections = document.querySelectorAll('.view-section');
    
    navItems.forEach(link => {
        link.addEventListener('click', (e) => {
            if(link.getAttribute('href') === '#') e.preventDefault();
            const targetId = link.getAttribute('data-target');
            if(!targetId) return;

            document.querySelectorAll('.sidebar-nav li').forEach(nav => nav.classList.remove('active'));
            link.parentElement.classList.add('active');
            
            viewSections.forEach(section => section.classList.remove('active'));
            const targetSection = document.getElementById(targetId);
            if(targetSection) {
                targetSection.classList.add('active');
                document.querySelector('.main-content').scrollTop = 0;
            }
        });
    });
}

function initFavoriteButtons() {
    // Delegación estática para botones previos
    const favBtns = document.querySelectorAll('.fav-btn');
    favBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); 
            const icon = btn.querySelector('i');
            if (icon.classList.contains('ph-heart')) {
                icon.classList.replace('ph-heart', 'ph-heart-fill');
                icon.style.color = 'var(--danger)';
                btn.style.transform = 'scale(1.2)';
                setTimeout(() => btn.style.transform = 'scale(1)', 150);
            } else {
                icon.classList.replace('ph-heart-fill', 'ph-heart');
                icon.style.color = ''; 
            }
        });
    });
}

function initSearchInteraction() {
    const searchInput = document.querySelector('.search-bar input');
    // Búsqueda en tiempo real sencilla
    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            const query = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('#medicamentos-grid .drug-card');
            cards.forEach(card => {
                const text = card.innerText.toLowerCase();
                if(text.includes(query)) card.style.display = 'flex';
                else card.style.display = 'none';
            });
            
            // Si el texto de busqueda es válido, saltar al panel de fármacos de forma automática.
            if(query.length > 2) {
                 const docLink = document.querySelector('a[data-target="medicamentos"]');
                 if(docLink && !document.getElementById('medicamentos').classList.contains('active')) {
                     docLink.click(); 
                 }
            }
        });
    }
}

/* =========================================================================
   BASE DE DATOS Y RENDERIZADO DEL CATÁLOGO DE MEDICAMENTOS
========================================================================= */

const medicamentosDb = [
    // --- ANTIALÉRGICOS Y AINES ---
    {
        principio: "Olopatadina",
        grupo: "Antihistamínico H1 y Estabilizador",
        forma: "Solución oftálmica",
        mecanismo: "Antagoniza receptores H1 y estabiliza mastocitos. Inhibe liberación de histamina y leucotrienos.",
        indicaciones: "Conjuntivitis alérgica estacional/perenne. Prurito ocular.",
        posologia: "0.1%: 1 gota c/12h. | 0.2%: 1 gota al día.",
        contraindicaciones: "Hipersensibilidad. Cuidado con lentes blandos.",
        adversos: "Ardor, ojo seco, visión borrosa transitoria, cefalea.",
        precauciones: "Retirar L.C. y esperar 15 min. Precaución embarazo/lactancia.",
        comercial: "Patanol®, Pataday®",
        categoria: "antialergicos"
    },
    {
        principio: "Ketotifeno",
        grupo: "Antihistamínico H1 y Estabilizador",
        forma: "Solución oftálmica",
        mecanismo: "Bloquea receptores H1, inhibe liberación de histamina por mastocitos y reduce migración eosinófila.",
        indicaciones: "Conjuntivitis alérgica, prurito ocular.",
        posologia: "1 gota cada 12 horas.",
        contraindicaciones: "Hipersensibilidad al medicamento.",
        adversos: "Irritación ocular, sequedad ocular, dolor leve.",
        precauciones: "Evitar contaminación del gotero. Retirar L.C. antes de aplicar.",
        comercial: "Zaditor®, Alaway®, Ketotifeno MK",
        categoria: "antialergicos"
    },
    {
        principio: "Azelastina",
        grupo: "Antihistamínico H1",
        forma: "Solución oftálmica",
        mecanismo: "Bloquea receptores H1 y reduce liberación de histamina y mediadores inflamatorios.",
        indicaciones: "Conjuntivitis alérgica estacional y perenne.",
        posologia: "1 gota 2 veces al día (c/12 h).",
        contraindicaciones: "Hipersensibilidad a la azelastina.",
        adversos: "Sabor amargo (drenaje lagrimal), ardor, ojo seco.",
        precauciones: "Precaución férrea en usuarios de Lentes de Contacto.",
        comercial: "Optivar®",
        categoria: "antialergicos"
    },
    {
        principio: "Alcaftadina",
        grupo: "Antihistamínico H1",
        forma: "Solución oftálmica",
        mecanismo: "Antagonista H1 con efecto antiinflamatorio añadido, frena activación mastocitaria.",
        indicaciones: "Conjuntivitis alérgica estacional.",
        posologia: "1 gota cada 24 horas (una vez al día).",
        contraindicaciones: "Hipersensibilidad manifiesta.",
        adversos: "Irritación, enrojecimiento, visión borrosa breve.",
        precauciones: "Retirar Lentes de Contacto.",
        comercial: "Lastacaft®",
        categoria: "antialergicos"
    },
    {
        principio: "Epinastina",
        grupo: "Antihistamínico H1",
        forma: "Solución oftálmica",
        mecanismo: "Bloquea receptores H1 e inhibe potentes mediadores inflamatorios.",
        indicaciones: "Conjuntivitis alérgica estacional. Prurito ocular asociado.",
        posologia: "1 gota cada 12 horas.",
        contraindicaciones: "Precaución en menores de 3 años y alergia conocida.",
        adversos: "Ardor, ojo seco, sensación de cuerpo extraño.",
        precauciones: "Evitar contaminación de la punta del frasco.",
        comercial: "Elestat®",
        categoria: "antialergicos"
    },
    {
        principio: "Bepotastina",
        grupo: "Antihistamínico H1",
        forma: "Solución oftálmica",
        mecanismo: "Bloqueo altamente selectivo H1. Reduce histamina.",
        indicaciones: "Conjuntivitis alérgica estacional.",
        posologia: "1 gota cada 12 horas.",
        contraindicaciones: "Alergia o hipersensibilidad.",
        adversos: "Irritación ocular recurrente, dolor leve.",
        precauciones: "No tocar el ojo con la punta del gotero.",
        comercial: "Bepreve®",
        categoria: "antialergicos"
    },
    {
        principio: "Cromoglicato de Sodio",
        grupo: "Estabilizador de Mastocitos",
        forma: "Solución oftálmica",
        mecanismo: "Estabiliza mastocitos para impedir la degranulación y liberación de histamina.",
        indicaciones: "Alergia ocular crónica, queratoconjuntivitis vernal.",
        posologia: "1 gota cada 6 horas.",
        contraindicaciones: "Hipersensibilidad severa.",
        adversos: "Ardor transitorio.",
        precauciones: "Uso prolongado sujeto a valoración médica.",
        comercial: "Opticrom®",
        categoria: "antialergicos"
    },
    {
        principio: "Lodoxamida",
        grupo: "Estabilizador de Mastocitos",
        forma: "Solución oftálmica",
        mecanismo: "Potente inhibidor de reacciones de hipersensibilidad tipo I y degranulación.",
        indicaciones: "Queratoconjuntivitis vernal y atópica.",
        posologia: "1 gota 4 veces al día.",
        contraindicaciones: "Hipersensibilidad general.",
        adversos: "Irritación, molestia post-instilación.",
        precauciones: "No usar L.C. durante todo el ciclo del tratamiento.",
        comercial: "Alomide®",
        categoria: "antialergicos"
    },
    {
        principio: "Ketorolaco",
        grupo: "Antiinflamatorio AINE",
        forma: "Solución oftálmica",
        mecanismo: "Inhibe la COX, limitando la biosíntesis de prostaglandinas dolorosas e inflamatorias.",
        indicaciones: "Dolor postoperatorio, conjuntivitis alérgica, inflamación general.",
        posologia: "1 gota cada 6–8 horas.",
        contraindicaciones: "Alergia a AINE o historial de alergia a aspirina.",
        adversos: "Ardor penetrante inicial, irritación.",
        precauciones: "Su uso hiperprolongado puede retrasar/fundir la cicatrización corneal.",
        comercial: "Acular®, Acuvail®",
        categoria: "antialergicos"
    },

    // --- LUBRICANTES OCULARES ---
    {
        principio: "Carboximetilcelulosa",
        grupo: "Lubricante base Celulosa",
        forma: "Solución (0.5% y 1%)",
        mecanismo: "Aporta estabilización física y viscosidad. Añade electrolitos afines a la lágrima.",
        indicaciones: "Ojo seco. Resequedad ocular general.",
        posologia: "1 gota cada 2-3h o a demanda.",
        contraindicaciones: "Ninguna crítica conocida.",
        adversos: "Sensación pegajosa (hipersensibilidad rara).",
        precauciones: "Apto en embarazo y lactancia de forma segura.",
        comercial: "Refresh, Optic, TearDew",
        categoria: "lubricantes"
    },
    {
        principio: "Hidroxietilcelulosa",
        grupo: "Lubricante base Celulosa",
        forma: "Solución tópica (0.2% y 1%)",
        mecanismo: "Genera matriz humectante suave sobre el epitelio corneal dañado.",
        indicaciones: "Protección ocular, alivio de la sequedad por clima.",
        posologia: "1 gota a demanda del paciente (aprox c/ 3h).",
        contraindicaciones: "Lactantes con alergia previa a Hidroxicina. Glaucoma Ángulo Cerrado (precaución).",
        adversos: "Ligera visión borrosa.",
        precauciones: "No mezclar administraciones inmediatas con otro fármaco (esperar 5 min).",
        comercial: "Eye Discover, Oftisol, Zukati, Hiprocel",
        categoria: "lubricantes"
    },
    {
        principio: "Polivinil Pirrolidona",
        grupo: "Lubricante de Polímero",
        forma: "Solución acuosa (0.5%)",
        mecanismo: "Polímero formador de película protectora, alto mucomimetismo y larga conservación de agua.",
        indicaciones: "Queratoconjuntivitis Sicca clásica. Sensación de arenilla.",
        posologia: "Instilación a demanda según nivel de confort.",
        contraindicaciones: "Ninguna conocida grave.",
        adversos: "Raras alergias de contacto.",
        precauciones: "Completamente seguro perfil clínico.",
        comercial: "Lubrik, Acuafil, Polycare",
        categoria: "lubricantes"
    },
    {
        principio: "Carbómero",
        grupo: "Lubricante Viscoso / Gel",
        forma: "Gel oftálmico (tópico)",
        mecanismo: "Actúa como andamiaje macromolecular (polímero espeso) prolongando extremandamente el tiempo de ruptura lagrimal (BUT).",
        indicaciones: "Ojo seco de moderado a severo. Fuerte exposición nocturna o pantallas.",
        posologia: "1 gota gel cada 4-6h o exclusivamente uso nocturno.",
        contraindicaciones: "Hipersensibilidad al polímero de carbómero.",
        adversos: "Borrosidad pesada visual (de pocos minutos a horas).",
        precauciones: "No conducir ni usar maquinas justo tras la aplicación.",
        comercial: "Lipotears Gel, Lacryvisc",
        categoria: "lubricantes"
    },
    {
        principio: "Hialuronato Sódico",
        grupo: "Mucopolisacárido viscoelástico",
        forma: "Solución en varias concentraciones (0.15% - 2.5%)",
        mecanismo: "Molécula esponja con suprema retención de agua y tropismo por el epitelio. Acelera regeneración de úlceras.",
        indicaciones: "Ojo Seco Post-Cirugía refractiva (LASIK, PRK), lesiones epiteliales por trauma.",
        posologia: "1 gota 2-4 veces por día.",
        contraindicaciones: "Hipersensibilidad a hialuronatos aviares o bacterianos.",
        adversos: "Normalmente neutros, molestias efímeras.",
        precauciones: "Asegurar compatibilidad con el tipo de Lente de Contacto si se aplica arriba de el.",
        comercial: "Hyabak, Hylo-Comod, Hialid",
        categoria: "lubricantes"
    },
    {
        principio: "Suero Autólogo",
        grupo: "Terapia Biológica Celular",
        forma: "Magistral en Gotas Colirio",
        mecanismo: "Único capaz de imitar las propiedades nutritivas complejas de la lágrima real (Factores crecimiento, Vit.A, Inmunoglobulinas).",
        indicaciones: "Defectos epiteliales persistentes tórpidos, Sd. de Sjögren grave.",
        posologia: "Estricto del especialista (común 1 gota c/2h-4h).",
        contraindicaciones: "Infecciones sistémicas transmisibles del donante/paciente.",
        adversos: "Infección corneal por contaminación cruzada del propio suero.",
        precauciones: "Obligatorio la conservación mediante estricta cadena de refrigeración.",
        comercial: "Preparación Hospitalaria",
        categoria: "lubricantes"
    },

    // --- CORTICOSTEROIDES ---
    {
        principio: "Fluorometolona / Medrisona / Hidrocortisona",
        grupo: "Corticosteroide Baja-Media Potencia",
        forma: "Suspensión oftálmica (0.5% - 1%)",
        mecanismo: "Inactiva Fosfolipasa A2, reduciendo la cadena inmune inicial.",
        indicaciones: "Blefaritis atópica, alergias leves inflamadas.",
        posologia: "1 gota 3–4 veces al día (tapering).",
        contraindicaciones: "Queratitis epitelial por Herpes Simple.",
        adversos: "Subida lenta de la PIO si se usa más de 10 días.",
        precauciones: "Revisar PIO basal del paciente.",
        comercial: "Cortisporin, FML",
        categoria: "corticosteroides"
    },
    {
        principio: "Loteprednol Etabonato",
        grupo: "Corticosteroide de diseño selectivo",
        forma: "Suspensión oftálmica (0.2% - 0.5%)",
        mecanismo: "Esteroide inestable en sangre. Controla quimiotaxis y estabiliza membrana pero interactúa poco con el humor acuoso (no sube mucho la presión).",
        indicaciones: "Uveítis anterior leve, conjuntivitis puramente alérgica en fase aguda fuerte.",
        posologia: "Aplicar en crisis, 1 gota x 4 dosis al día.",
        contraindicaciones: "Microorganismos vivos sin controlar (virus, hongos).",
        adversos: "Menor efecto perjudicial sobre la PIO que pred/dexa.",
        precauciones: "Agitar brutalmente el frasco siempre.",
        comercial: "Lotemax®, Alrex®",
        categoria: "corticosteroides"
    },
    {
        principio: "Prednisolona",
        grupo: "Corticosteroide de Alta Potencia",
        forma: "Acetato / Suspensión 1%",
        mecanismo: "Bloqueo brutal de histamina y factor tisular.",
        indicaciones: "Inflamación abismal: queratoconjuntivitis estacional masiva incontrolable o vernal, Uveítis agudas.",
        posologia: "Pauta de impregnación e ir bajando (tapering). 4-6 veces iniciales.",
        contraindicaciones: "Pacientes con herida corneal abierta (riesgo de licuación del ojo) o glaucoma.",
        adversos: "Pico de Hipertensión Ocular brutal, glaucoma esteroideo veloz, catarata.",
        precauciones: "Descontinuar requiere disminución lenta. Peligro altísimo automedicación.",
        comercial: "Pred Forte®",
        categoria: "corticosteroides"
    },
    {
        principio: "Dexametasona",
        grupo: "Corticosteroide Ultrasistémico / Potente",
        forma: "Suspensión (0.1%)",
        mecanismo: "Antiinflamatorio inhibiendo COX1/COX2 mediante bloqueo genómico celular.",
        indicaciones: "Pacientes quirúrgicos y severamente alérgicos con alto componente vascular.",
        posologia: "Dosis médica regulada reduccionista.",
        contraindicaciones: "Micobacterias en córnea, Herpes.",
        adversos: "Alta probabilidad evolutiva hacia Ceguera Glaucomatosa si se abusa.",
        precauciones: "Agitar el frasco. Visitar biomesualmente al oftalmólogo para check Tonométrico.",
        comercial: "Maxidex®, Tobradex® (mixto)",
        categoria: "corticosteroides"
    },

    // --- ANTICOLINÉRGICOS ---
    {
        principio: "Atropina",
        grupo: "Anticolinérgico de acción prolongada",
        forma: "Solución oftálmica 0.5% – 1%",
        mecanismo: "Bloqueo competitivo de receptores muscarínicos M3 en el iris y músculo ciliar.",
        indicaciones: "Uveítis anterior, control del dolor por espasmo ciliar y cicloplejia profunda en refracción.",
        posologia: "Uso clínico controlado (usualmente 1 gota/día o dosis única en consultorio).",
        contraindicaciones: "Glaucoma de ángulo cerrado o sospecha del mismo.",
        adversos: "Taquicardia, sequedad bucal, retención urinaria, fiebre.",
        precauciones: "Produce midriasis y cicloplejia muy prolongada. Extrema precaución en niños por toxicidad sistémica.",
        comercial: "Isopto Atropina®",
        categoria: "anticolinergicos"
    },
    {
        principio: "Ciclopentolato",
        grupo: "Anticolinérgico de acción intermedia",
        forma: "Solución oftálmica 0.5% – 1%",
        mecanismo: "Bloqueo puntual de receptores muscarínicos en el músculo esfínter del iris y ciliar.",
        indicaciones: "Refracción en niños y exámenes diagnósticos rutinarios.",
        posologia: "1 gota previo al examen (repite 5-10 min si necesario).",
        contraindicaciones: "Glaucoma de ángulo estrecho no operado.",
        adversos: "Somnolencia transitoria y taquicardia leve.",
        precauciones: "Ejerce midriasis y cicloplejia de tipo moderada.",
        comercial: "Cyclogyl®, Ciclopentolato MK",
        categoria: "anticolinergicos"
    },
    {
        principio: "Tropicamida",
        grupo: "Anticolinérgico de acción corta",
        forma: "Solución oftálmica 0.5% – 1%",
        mecanismo: "Potente antagonista muscarínico de duración muy breve en la unión neuromuscular parasimpática.",
        indicaciones: "Exámenes diagnósticos de fondo de ojo rutinarios.",
        posologia: "1 a 2 gotas entre 15-20 mins antes de examinar.",
        contraindicaciones: "Glaucoma de ángulo cerrado/estrecho o riesgo de cierre.",
        adversos: "Sequedad bucal tenue, cefalea visual y aumento leve del pulso.",
        precauciones: "Fotofobia residual temporal rápida. Midriasis leve, cicloplejia casi nula.",
        comercial: "Mydriacyl®",
        categoria: "anticolinergicos"
    },

    // --- ANTIGLAUCOMATOSOS Y COLINÉRGICOS ---
    {
        principio: "Timolol",
        grupo: "Antiglaucomatoso (Betabloqueador)",
        forma: "Solución oftálmica 0.25% – 0.5%",
        mecanismo: "Bloqueo de receptores β1 en el cuerpo ciliar. Inhibe fuertemente la producción y secreción de humor acuoso.",
        indicaciones: "Hipertensión ocular y Glaucoma de ángulo abierto primario.",
        posologia: "1 gota cada 12 o 24 horas (mañana/noche).",
        contraindicaciones: "Asma, EPOC severo, bradicardia, bloqueo AV o cardiogénico.",
        adversos: "Bradicardia sintomática en adultos mayores, hipotensión nocturna, broncoespasmo pulmonar.",
        precauciones: "Enseñar al paciente a realizar oclusión del punto lagrimal al aplicar.",
        comercial: "Timoptol®, Cusimolol®",
        categoria: "antiglaucomatosos"
    },
    {
        principio: "Brimonidina",
        grupo: "Antiglaucomatoso (Agonista Alfa-2)",
        forma: "Solución oftálmica 0.1% – 0.2%",
        mecanismo: "Estimula receptores α2 de forma muy selectiva. Frena la secreción acuosa y acelera el drenaje por vía uveoescleral secundaria.",
        indicaciones: "Glaucoma de ángulo abierto e hipertensión ocular.",
        posologia: "1 gota cada 8 o 12 horas.",
        contraindicaciones: "Pacientes con uso de inhibidores MAO sistémicos o niños menores de 2 años (depresión SNC).",
        adversos: "Sequedad oral, somnolencia acusada matutina, fatiga sistémica y conjuntivitis folicular alérgica.",
        precauciones: "Precaución con conductores si causa fatiga visual y somnolencia.",
        comercial: "Alphagan®",
        categoria: "antiglaucomatosos"
    },
    {
        principio: "Dorzolamida",
        grupo: "Antiglaucomatoso IAC",
        forma: "Solución oftálmica 2%",
        mecanismo: "Inhibe la catálisis de la anhidrasa carbónica (isoenzima II) en los procesos ciliares deteniendo la formación de bicarbonato.",
        indicaciones: "Glaucoma de ángulo abierto (como terapia combinada general o monoterapia).",
        posologia: "1 gota cada 8 a 12 horas.",
        contraindicaciones: "Descompensación endotelial corneal, alergia fuerte a las sulfas.",
        adversos: "Percepción de sabor francamente metálico tras la instilación. Ardor molesto inmediato.",
        precauciones: "Precaución en insuficiencia hepática/renal sistémica.",
        comercial: "Trusopt®",
        categoria: "antiglaucomatosos"
    },
    {
        principio: "Pilocarpina",
        grupo: "Antiglaucomatoso Miótico",
        forma: "Solución oftálmica 1% – 4%",
        mecanismo: "Acelera la contracción del músculo esfínter y ciliar estirando el espolón escleral (incrementa brutalmente el drenaje vía trabecular).",
        indicaciones: "Ataque agudo y Glaucoma de Ángulo Cerrado (GAC). Inducción pupilar intra-quirúrgica.",
        posologia: "1 gota c/hora en ataque o mantenimiento c/6h.",
        contraindicaciones: "Uveítis o condiciones donde el músculo ciliar no pueda ser estimulado.",
        adversos: "Espasmo doloroso acomodativo, miopía inducida, miosis nocturna severa y sudoración sistémica/bradicardia.",
        precauciones: "Fármaco clásico. Interfiere gravemente con la visión nocturna al manejar.",
        comercial: "Pilocar®",
        categoria: "antiglaucomatosos"
    },
    {
        principio: "Fisostigmina / Ecotiofato",
        grupo: "Anticolinesterasa (Acción Indirecta)",
        forma: "Solución oftálmica / Ungüento",
        mecanismo: "Inhibición irreversible de la acetilcolinesterasa aumentando la Vida-Media de la acetilcolina en nervios oculares.",
        indicaciones: "Casos rebeldes de Glaucoma crónico (y estrabismo acomodativo).",
        posologia: "Prescrito bajo prescripción ultra-especializada.",
        contraindicaciones: "Asma florida sistémica, úlcera gástrica, oclusión pupilar potencial.",
        adversos: "Lagrimeo colinérgico, espasmos dolorosos severos, cataratas tempranas.",
        precauciones: "Mucho más duraderos y tóxicos que los análogos directos.",
        comercial: "Phospholine® (Ecotiofato)",
        categoria: "antiglaucomatosos"
    },

    // --- INMUNOMODULADORES Y AINES ADICIONALES ---
    {
        principio: "Ciclosporina A",
        grupo: "Inmunomodulador",
        forma: "Emulsión oftálmica 0.05%",
        mecanismo: "Péptido cíclico que inhibe la activación de linfocitos T bloqueando celularmente la calcineurina.",
        indicaciones: "Ojo seco inflamatorio, conjuntivitis alérgica severa crónica.",
        posologia: "1 gota cada 12 horas.",
        contraindicaciones: "Infecciones oculares activas de orden viral o fúngico.",
        adversos: "Ardor ocular al instilar franco, hiperemia y sensación térmica transitoria.",
        precauciones: "Monitorear en tratamientos de meses a años.",
        comercial: "Restasis®, Cikavas®",
        categoria: "aines"
    },
    {
        principio: "Tacrolimus",
        grupo: "Inmunomodulador",
        forma: "Ungüento oftálmico",
        mecanismo: "Inhibe la activación en cascada de linfocitos T inhibiendo su calcineurina celular.",
        indicaciones: "Conjuntivitis alérgica grave resistente a tratamientos antialérgicos primarios.",
        posologia: "Aplicación tópica leve a demanda (1-2 veces al día).",
        contraindicaciones: "Infección activa corneal o conjuntival evidente.",
        adversos: "Incomodidad por quemazón y ardor prolongado tras disolución del ungüento.",
        precauciones: "No frotar el ojo duro inmediatamente posterior. Aseo riguroso.",
        comercial: "Protopic®, Tacrolimus Ungüento Oft.",
        categoria: "aines"
    },
    {
        principio: "Diclofenaco",
        grupo: "Antiinflamatorio no esteroideo (AINE)",
        forma: "Solución oftálmica 0.1%",
        mecanismo: "Inhibe la ciclooxigenasa (COX) de modo potente, disminuyendo de forma neta prostaglandinas generadoras de dolor.",
        indicaciones: "Dolor ocular postoperatorio inmediato, inflamación mecánica y fotocoagulación inducida.",
        posologia: "1 gota cada 6 a 8 horas (en crisis posqx puede ser cada 4h).",
        contraindicaciones: "Alergia o sensibilidad sistémica franca a los AINEs farmacéuticos.",
        adversos: "Irritación ocular intensa transitoria al instilar. Molestias visuales focales.",
        precauciones: "Riesgo de melting (fundición) corneal y opacidades al abusar sin supervisión.",
        comercial: "Voltaren Oftálmico®, Diclofenaco MK",
        categoria: "aines"
    },
    
    // --- ANTIMICROBIANOS (Antibióticos, Antivirales, Antimicóticos) ---
    {
        principio: "Ciprofloxacina",
        grupo: "Antibiótico Fluoroquinolona (Amplio Gram-)",
        forma: "Solución oftálmica / Ungüento",
        mecanismo: "Frena letalmente la replicación celular bacteriana neutralizando la ADN girasa y la topoisomerasa IV.",
        indicaciones: "Úlceras corneales biológicas infecciosas y conjuntivitis bacterianas purulentas severas.",
        posologia: "Muy agresivo al inicio: 1-2 gotas c/2h. Luego distanciar c/4h-6h.",
        contraindicaciones: "Sensibilidad directa a quinolonas sistémicas.",
        adversos: "Famoso por causar un precipitado cristalino blanco corneal que desaparece postratamiento.",
        precauciones: "Rotar si hay resistencia para no crear cepas súper-organismos.",
        comercial: "Ciloxan®, Sophipren®",
        categoria: "antimicrobianos"
    },
    {
        principio: "Moxifloxacina",
        grupo: "Antibiótico Fluoroquinolona (4ta Gen)",
        forma: "Solución oftálmica 0.5%",
        mecanismo: "Mecanismo doble inhibitorio contra topoisomerasa IV y ADN girasa asimilando mayor espectro bacteriano.",
        indicaciones: "Queratitis severas y profilaxis ocular en quirófano de forma obligada endoftalmítica.",
        posologia: "1 gota 3 veces al día o esquema intensivo guiado.",
        contraindicaciones: "Infección probada viral o fúngica sin soporte biológico complementario.",
        adversos: "Muy buena tolerabilidad a diferencias de antiguas generaciones.",
        precauciones: "Fármaco muy noble y de penetración excelente en humor acuoso estéril.",
        comercial: "Vigamox®",
        categoria: "antimicrobianos"
    },
    {
        principio: "Aciclovir",
        grupo: "Antiviral Específico",
        forma: "Ungüento oftálmico espeso 3%",
        mecanismo: "Detiene la síntesis del ADN al inhibir en la célula la matriz de poli-reproducción del virus.",
        indicaciones: "Queratitis herpética simple clásica (Dendríticas) y lesiones zóster oftálmicas focales.",
        posologia: "Mucha constancia: Aplicación 5 veces al día (solo en las horas en vigilia) durante semanas.",
        contraindicaciones: "Córnea completamente necrótica general.",
        adversos: "Nubla significativamente la visión. Pequeñas úlceras transitorias tóxicas.",
        precauciones: "Debe sostenerse el esquema mínimo unos 3 o 5 días tras resolución visual limpia.",
        comercial: "Zovirax Oftálmico®",
        categoria: "antimicrobianos"
    },
    {
        principio: "Natamicina",
        grupo: "Antimicótico Poliánico Fúngico",
        forma: "Suspensión oftálmica lechosa 5%",
        mecanismo: "Ancla y perfora los ladrillos de ergosterol de la membrana fúngica externa provocando un estallido osmótico del hongo.",
        indicaciones: "Queratitis destructivas por hongos potentes: Aspergillus, Fusarium y cepas profundas de Candida spp.",
        posologia: "Dosis tóxica terapéutica: 1 gota c/1 hora. Muy abrasivo el tratamiento pero necesario.",
        contraindicaciones: "Ausencia verificada de microbiología fúngica al raspado corneal.",
        adversos: "Reacción tóxica epitelio-destructiva y molestias agudas por lisis fúngica.",
        precauciones: "Enfermedades gravísimas; los pronósticos rondan los meses completos de tratamiento rudo continuo.",
        comercial: "Natacyn®",
        categoria: "antimicrobianos"
    },

    // --- VASOCONSTRICTORES ---
    {
        principio: "Nafazolina / Tetrahidrozolina",
        grupo: "Agonista Alfa-Adrenérgico (Vasoconstrictor)",
        forma: "Solución oftálmica 0.025% – 0.1%",
        mecanismo: "Estimula fuertemente receptores α-adrenérgicos del músculo liso en capilares conjuntivales, reduciendo el flujo sanguíneo.",
        indicaciones: "Rápido blanqueamiento de hiperemia ocular leve, fatiga y exposición alérgico-química residual.",
        posologia: "1 gota en ojo afectado hasta 4 veces al día (Uso máximo: 3 a 5 días).",
        contraindicaciones: "Predisposición o diagnóstico de Glaucoma de ángulo cerrado. Hipertensión incontrolada.",
        adversos: "Midriasis temporal leve, resequedad aguda.",
        precauciones: "Peligro: El uso prolongado de días producirá 'Efecto Rebote' (Hiperemia Reactiva Permanente).",
        comercial: "Visine®, Nazil®, Clear Eyes®",
        categoria: "vasoconstrictores"
    },
    {
        principio: "Fenilefrina / Oximetazolina",
        grupo: "Simpaticomimético Fuerte",
        forma: "Colirio o Solución oftálmica",
        mecanismo: "Afinidad directa por los receptores alfa con potente acción de constricción vascular local.",
        indicaciones: "Ojo extremadamente rojo clínico. (La Fenilefrina en alta dosis es usada para dilatar pupilas diagnósticas).",
        posologia: "Instilación ocasional a demanda o bajo protocolo clínico dilatante.",
        contraindicaciones: "Pacientes infartados o con hipertiroidismo galopante.",
        adversos: "Taquicardia pasajera tras absorción por conducto nasolagrimal, nerviosismo sistémico.",
        precauciones: "No tratar jamás el ojo rojo con blanqueadores indiscriminados, porque ocultan diagnósticos graves subyacentes.",
        comercial: "Ocuclear®",
        categoria: "vasoconstrictores"
    },

    // --- ANTIMICROBIANOS ADICIONALES ---
    {
        principio: "Tobramicina / Gentamicina",
        grupo: "Antibiótico Aminoglucósido",
        forma: "Solución oftálmica 0.3% / Ungüento",
        mecanismo: "Inhibe la síntesis proteica uniéndose agresivamente a la subunidad 30S en el citosol bacteriano.",
        indicaciones: "Conjuntivitis bacteriana clásica comunitaria y perfiles de Blefaritis anterior / Queratitis.",
        posologia: "Dosis variable: de 1 a 2 gotas cada 4 o 6 horas basales.",
        contraindicaciones: "Hipersensibilidad detectada previamente al fármaco.",
        adversos: "Fuerte quemazón temporal (especialmente Gentamicina) y picor de conjuntiva.",
        precauciones: "Los aminoglucósidos suelen ser tóxicos para el epitelio corneal si se abusa de ellos a largo plazo.",
        comercial: "Tobrex®, Gentamicina MK",
        categoria: "antimicrobianos"
    },
    {
        principio: "Cloranfenicol",
        grupo: "Antimicrobiano de Amplio Espectro (Bacteriostático)",
        forma: "Gotas oftálmicas 0.5%",
        mecanismo: "Interviene la enzima peptidiltransferasa de la subunidad 50S deteniendo la maquinaria proteica infecciosa.",
        indicaciones: "Infecciones de alta resistencia que ameritan drogas clásicas duras.",
        posologia: "1 gota instilada cada 6 horas.",
        contraindicaciones: "Cualquier rastro de hipoplasia o discrasia medular pre-existente.",
        adversos: "Irritación franca. Posee reportes bibliográficos raros de aplasia medular sistémica letal por absorción (de ahí que su uso está decayendo).",
        precauciones: "Guardar estrictamente como última opción terapéutica comunitaria en centros guiados.",
        comercial: "Cloramfeni®, Quemicetina®",
        categoria: "antimicrobianos"
    },
    {
        principio: "Ofloxacino",
        grupo: "Fluoroquinolona de 2da/3ra Generación",
        forma: "Solución oftálmica 0.3%",
        mecanismo: "Neutraliza directamente el tren enzimático de reproducción topoisomerasa microbiana.",
        indicaciones: "Ataque veloz ante Queratitis bacteriana agresiva ulcerada.",
        posologia: "Escalada aguda: 1-2 gotas c/4 horas (o más fuerte si peligra córnea).",
        contraindicaciones: "Alergias a grupos florados.",
        adversos: "Lagrimeo en cascada inducido temporalmente.",
        precauciones: "Debe descontinuarse progresivamente.",
        comercial: "Ocuflox®, Oflox Oftálmico",
        categoria: "antimicrobianos"
    },
    {
        principio: "Ganciclovir",
        grupo: "Antiviral Citostático Específico",
        forma: "Gel oftálmico de depósito continuo 0.15%",
        mecanismo: "Análogo de guanosina que secuestra la ADN polimerasa del citomegalovirus o herpes, reventando su reproducción celular en la córnea.",
        indicaciones: "Queratitis Herpética Aguda estromal y profundas invasiones virales atípicas.",
        posologia: "Pauta constante dependiente del virus: 1 gota de gel hasta 5 veces al día. Mantenimiento: 3v/día.",
        contraindicaciones: "Eritema multiforme asociado o toxicidad de matriz conocida.",
        adversos: "Fuerte visión borrosa por la densidad y alto índice del gel. Reacciones de pinchazo nervioso.",
        precauciones: "Alta vigilancia de hepatotoxicidad o reacciones cruzadas en pacientes de UCI oftálmicas.",
        comercial: "Virgan®",
        categoria: "antimicrobianos"
    }

];

// Función para pintar tarjetas con filtrado activo (Diseño UI moderno y visual)
function renderMedicamentos(filtro = 'todos', botonClickeado = null) {
    const container = document.getElementById('medicamentos-grid');
    if (!container) return;

    // Efecto visual a los botones de categoría
    if (botonClickeado) {
        document.querySelectorAll('.btn-filter').forEach(btn => {
            btn.style.backgroundColor = 'var(--bg-card)';
            btn.style.color = 'var(--text-main)';
            btn.style.borderColor = 'var(--border-color)';
        });
        botonClickeado.style.backgroundColor = 'var(--primary)';
        botonClickeado.style.color = 'white';
        botonClickeado.style.borderColor = 'var(--primary)';
    }

    container.innerHTML = ''; 

    // Filtrado de data
    const filtrados = filtro === 'todos' 
        ? medicamentosDb 
        : medicamentosDb.filter(m => m.categoria === filtro);

    // Iteración para construir nodos DOM
    filtrados.forEach(med => {
        const card = document.createElement('div');
        card.className = 'drug-card';
        // Interacción para botón "like"
        card.innerHTML = `
            <div class="drug-card-header" style="margin-bottom: 12px;">
                <span class="tag-badge" style="background-color:rgba(0, 119, 182, 0.1); color:var(--primary); font-size:12px; letter-spacing:0.5px;">${med.grupo}</span>
                <button class="fav-btn" onclick="javascript:const icon = this.querySelector('i'); if(icon.classList.contains('ph-heart')) { icon.classList.replace('ph-heart', 'ph-heart-fill'); icon.style.color = 'var(--danger)'; this.style.transform='scale(1.2)'; setTimeout(()=>this.style.transform='scale(1)', 150);} else { icon.classList.replace('ph-heart-fill', 'ph-heart'); icon.style.color = ''; } arguments[0].stopPropagation();"><i class="ph ph-heart"></i></button>
            </div>
            <div class="drug-card-body">
                <h3 style="font-size:20px; color:var(--text-main); margin-bottom:2px;">${med.principio}</h3>
                <p style="color:var(--text-muted); font-size:13px; margin-bottom:16px; font-weight:500;">
                    ${med.comercial} <br><span style="font-weight:400; font-size:12px; color:var(--text-muted); opacity:0.8;">${med.forma}</span>
                </p>
                
                <div style="border-top: 1px solid var(--border-color); padding-top: 16px; display:flex; flex-direction:column; gap:10px;">
                    <div><strong style="font-size:11px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px;">Mecanismo de acción</strong><p style="font-size:13px; margin-top:2px;">${med.mecanismo}</p></div>
                    <div><strong style="font-size:11px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px;">Indicaciones Clínicas</strong><p style="font-size:13px; margin-top:2px;">${med.indicaciones}</p></div>
                    <div><strong style="font-size:11px; color:var(--primary); text-transform:uppercase; letter-spacing:0.5px;">Posología (Dosis estándar)</strong><p style="font-size:13px; margin-top:2px; font-weight:600; color:var(--text-main);">${med.posologia}</p></div>
                    
                    <details style="margin-top:8px;">
                        <summary class="premium-summary">Ver Seguridad y Adversos</summary>
                        <div style="margin-top:12px; display:flex; flex-direction:column; gap:10px; background-color:rgba(239, 68, 68, 0.03); padding:16px; border-radius:var(--radius-md); border:1px solid rgba(239, 68, 68, 0.15);">
                            <div><strong style="font-size:11px; color:var(--danger); text-transform:uppercase; letter-spacing:0.5px;">Efectos Adversos</strong><p style="font-size:13px; margin-top:2px; color:var(--text-main);">${med.adversos}</p></div>
                            <div><strong style="font-size:11px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px;">Contraindicaciones</strong><p style="font-size:13px; margin-top:2px; color:var(--text-main);">${med.contraindicaciones}</p></div>
                            <div><strong style="font-size:11px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px;">Precauciones</strong><p style="font-size:13px; margin-top:2px; color:var(--text-main);">${med.precauciones}</p></div>
                        </div>
                    </details>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}
