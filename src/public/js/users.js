console.log("Users frontend javascript file");

// --- QISM 1: FRONTEND FUNKSIONALLIGI (jQuery & Axios) ---
$(function() {
    $(".member-status").on("focus", function () {
        // Oldingi qiymatni saqlab qolish (xatolik bo'lsa qaytarish uchun)
        $(this).data("original-value", $(this).val());
    });

    $(".member-status").on("change", async function(e) {
        const id = e.target.id;
        const memberStatus = $(this).val();
        const originalValue = $(this).data("original-value");
        const $selectElement = $(this);

        try {
            // Loading effekti: Selectni vaqtincha o'chiramiz
            $selectElement.prop('disabled', true).css('opacity', '0.5');

            const response = await axios.post("/admin/user/edit", {
                _id: id,
                memberStatus: memberStatus,
            });
            
            const result = response.data;

            if(result.data) {
                console.log("User updated successfully");
                // Muvaffaqiyatli o'zgarganligini vizual ko'rsatish (yashil chegara)
                $selectElement.css('border-color', '#28a745');
                setTimeout(() => { $selectElement.css('border-color', ''); }, 1500);
            } else {
                alert("User update failed!");
                // Xatolik bo'lsa eski qiymatni qaytaramiz
                $selectElement.val(originalValue);
            }

        } catch (err) {
            console.log(err);
            alert("User update failed due to network error.");
            $selectElement.val(originalValue);
        } finally {
            // Selectni qayta yoqamiz
            $selectElement.prop('disabled', false).css('opacity', '1');
            $selectElement.blur();
        }
    });
});


// --- QISM 2: THREE.JS 3D ORQA FON (Nuqtalar Shari - Point Globe) ---
(function () {
    let scene, camera, renderer;
    let globePoints;
    let mouseX = 0, mouseY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    init();
    animate();

    function init() {
        const container = document.getElementById('canvas-container-users');
        if (!container) return; // Agar logged out bo'lsa, container bo'lmasligi mumkin

        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x0f0c29, 0.001);

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000);
        camera.position.z = 800;

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        // --- Geometriya: Nuqtalardan iborat Shar ---
        const geometry = new THREE.SphereGeometry(400, 60, 60);
        
        // PointsMaterial - faqat uchlarini (vertikallarini) ko'rsatadi
        const material = new THREE.PointsMaterial({
            color: 0x4facfe, // Zangori rang (accent color)
            size: 3,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        globePoints = new THREE.Points(geometry, material);
        scene.add(globePoints);

        // --- Yoritish ---
        const ambientLight = new THREE.AmbientLight(0x222222);
        scene.add(ambientLight);
        
        // Orqa tomondan yorug'lik berish (kontur uchun)
        const backLight = new THREE.PointLight(0xe3c08d, 2, 1000);
        backLight.position.set(0, 0, -600);
        scene.add(backLight);


        // Events
        window.addEventListener('resize', onWindowResize);
        document.addEventListener('mousemove', onDocumentMouseMove);
    }

    function onWindowResize() {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onDocumentMouseMove(event) {
        mouseX = (event.clientX - windowHalfX) * 0.1;
        mouseY = (event.clientY - windowHalfY) * 0.1;
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    function render() {
        if (!globePoints) return;

        // Sharni sekin aylantirish
        globePoints.rotation.y += 0.002;
        globePoints.rotation.x += 0.0005;

        // Parallax effekti
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }
})();