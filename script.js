document.addEventListener('DOMContentLoaded', function() {
    const nftIdInput = document.getElementById('nft-id');
    const loadNftBtn = document.getElementById('load-nft-btn');
    const fontSelect = document.getElementById('font-select');
    const textColorInput = document.getElementById('text-color');
    const outlineColorInput = document.getElementById('outline-color');
    const downloadBtn = document.getElementById('downloadBtn');
    const textInput = document.getElementById('banner-text');
    const mirrorCheckbox = document.getElementById('mirror-checkbox');
    const canvas = document.getElementById('banner-canvas');
    const ctx = canvas.getContext('2d');
    const logoCheckbox = document.getElementById('add-logo');

    textInput.addEventListener('input', drawVisibleBanner);

    // Charger un NFT via OpenSea API
    loadNftBtn.addEventListener('click', loadNFT);

    // Capturer les curseurs
    const imageSizeSlider = document.getElementById('image-size');
    const imageXSlider = document.getElementById('image-x');
    const imageYSlider = document.getElementById('image-y');

    const logoSizeSlider = document.getElementById('logo-size');
    const logoXSlider = document.getElementById('logo-x');
    const logoYSlider = document.getElementById('logo-y');

    const textSizeSlider = document.getElementById('text-size');
    const textXSlider = document.getElementById('text-x');
    const textYSlider = document.getElementById('text-y');

    // Position et taille initiales
    let logoSize = 200; // Taille initiale du logo
    let logoPosition = { x: 20, y: -40 }; // Position initiale du logo

    let imageSize = 500; // Taille initiale des images téléchargées
    let imagePosition = { x: 1000, y: 0 }; // Position initiale des images téléchargées

    let textSize = 120; // Taille initiale du texte
    let textPosition = { x: 600, y: 280 }; // Position initiale du texte

    // Variable pour stocker la couleur de fond
    let backgroundColor = "#FFFFFF"; // Couleur de fond par défaut

    // Charger l'image de fond
    const backgroundImage = new Image();
    backgroundImage.src = 'images/banner-bg/banner-background.png';

    const logoImage = new Image();
    logoImage.src = 'images/logo/logo.png'; // Assurez-vous que le chemin du logo est correct

    // Variable pour stocker l'image NFT
    let nftImage = null;
    let nftMetadata = null; // Pour stocker les métadonnées du NFT

    // Charger l'image de fond au démarrage
    backgroundImage.onload = () => {
        textInput.value = "Your text here";
        drawVisibleBanner();
    };

    // Fonction pour obtenir la couleur de fond à partir des métadonnées
    function getBackgroundColor(metadata) {
        if (metadata && metadata.traits && Array.isArray(metadata.traits)) {
            const backgroundTrait = metadata.traits.find(trait => trait.trait_type === "Background");
            const colorMapBackground = {
                "Green": "#9bbe62",
                "Blue": "#0052fe",
                "Purple": "#7461bd",
                "Yellow": "#ffdb6c",
                "Pink": "#d7696a",
                "Teal": "#17c3c8",
                "White": "#f9f5f4"
            };

            if (backgroundTrait) {
                return colorMapBackground[backgroundTrait.value] || "#FFFFFF";
            }

            const baseTrait = metadata.traits.find(trait => trait.trait_type === "Base");
            const colorMapBase = {
                "Mom's Favorite": "#7c90a9",
                "Teacher's Pet": "#d891b1",
                "Scary Hooman": "#cccccc"
            };

            if (baseTrait) {
                return colorMapBase[baseTrait.value] || "#FFFFFF";
            }
        }

        return "#FFFFFF";  
    }

    // Charger un NFT via OpenSea API
    function loadNFT() {
        const apiKey = '3a0bb7983c7841e6a0770e39305fa084'; // Remplace par ta clé API OpenSea
        const contractAddress = '0xbe3c7aBaB76F0a1dE602fDB2f44faF604a5F649F'; // Adresse du contrat
        const tokenId = nftIdInput.value;
        const apiUrl = `https://api.opensea.io/api/v2/chain/base/contract/${contractAddress}/nfts/${tokenId}`;
    
        fetch(apiUrl, {
            headers: {
                'X-API-KEY': apiKey,
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.nft && data.nft.image_url) {
                // Exemple d'extraction de la couleur de fond des métadonnées
                backgroundColor = getBackgroundColor(data.nft); // Obtenir la couleur de fond à partir des métadonnées
    
                const tempNftImage = new Image();
                tempNftImage.crossOrigin = "Anonymous";
                tempNftImage.src = data.nft.image_url;
    
                tempNftImage.onload = () => {
                    nftImage = tempNftImage;
                    mirrorCheckbox.checked = true; // Coche la case pour l'effet miroir
                    drawVisibleBanner(); // Redessiner le canvas après le chargement de l'image
                };
            } else {
                console.error('Invalid API response or NFT not found.');
                alert('Erreur : NFT non trouvé ou réponse API invalide.');
            }
        })
        .catch(error => {
            console.error('Error loading NFT image:', error);
            alert('Erreur lors du chargement de l\'image du NFT.');
        });
    }
    

    function applyMirrorEffect(image, x, y, size) {
        if (mirrorCheckbox.checked) {
            // Appliquer l'effet miroir horizontal
            ctx.save();
            ctx.scale(-1, 1); // Inverser l'axe x
            ctx.drawImage(image, -x - size, y, size, size); // Dessiner l'image inversée
            ctx.restore();
        } else {
            // Dessiner l'image normalement
            ctx.drawImage(image, x, y, size, size);
        }
    }

    function drawVisibleBanner() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Appliquer la couleur de fond
        ctx.fillStyle = backgroundColor; // Utiliser la couleur de fond du NFT
        ctx.fillRect(0, 0, canvas.width, canvas.height); // Remplir le canvas avec la couleur
        
        // Dessiner le logo si la case est cochée
        if (logoCheckbox.checked) {
            ctx.drawImage(logoImage, logoPosition.x, logoPosition.y, logoSize, logoSize);
        }
        
        // Dessiner l'image NFT si elle est chargée avec effet miroir
        if (nftImage) {
            applyMirrorEffect(nftImage, imagePosition.x, imagePosition.y, imageSize);
        }
        
        // Dessiner le texte
        const text = textInput.value;
        if (text) {
            ctx.font = textSize + 'px ' + fontSelect.value;
            ctx.fillStyle = textColorInput.value;
            ctx.strokeStyle = outlineColorInput.value;
            ctx.lineWidth = 4;
    
            const x = textPosition.x;
            const y = textPosition.y;
    
            ctx.strokeText(text, x, y);
            ctx.fillText(text, x, y);
        }
    }

    // Ajouter un écouteur d'événements pour redessiner le canvas si l'état de la case change
    mirrorCheckbox.addEventListener('change', drawVisibleBanner);
    logoCheckbox.addEventListener('change', drawVisibleBanner);
    fontSelect.addEventListener('change', drawVisibleBanner);
    textColorInput.addEventListener('input', drawVisibleBanner);
    outlineColorInput.addEventListener('input', drawVisibleBanner);

    // Ajouter des écouteurs pour les sliders
    logoSizeSlider.addEventListener('input', (event) => {
        logoSize = event.target.value; // Met à jour la taille du logo
        drawVisibleBanner();
    });

    logoXSlider.addEventListener('input', (event) => {
        logoPosition.x = event.target.value; // Met à jour la position X du logo
        drawVisibleBanner();
    });

    logoYSlider.addEventListener('input', (event) => {
        logoPosition.y = event.target.value; // Met à jour la position Y du logo
        drawVisibleBanner();
    });

    imageSizeSlider.addEventListener('input', (event) => {
        imageSize = event.target.value; // Met à jour la taille de l'image
        drawVisibleBanner();
    });

    imageXSlider.addEventListener('input', (event) => {
        imagePosition.x = event.target.value; // Met à jour la position X de l'image
        drawVisibleBanner();
    });

    imageYSlider.addEventListener('input', (event) => {
        imagePosition.y = event.target.value; // Met à jour la position Y de l'image
        drawVisibleBanner();
    });

    textSizeSlider.addEventListener('input', (event) => {
        textSize = event.target.value; // Met à jour la taille du texte
        drawVisibleBanner();
    });

    textXSlider.addEventListener('input', (event) => {
        textPosition.x = event.target.value; // Met à jour la position X du texte
        drawVisibleBanner();
    });

    textYSlider.addEventListener('input', (event) => {
        textPosition.y = event.target.value; // Met à jour la position Y du texte
        drawVisibleBanner();
    });

    // Fonction pour télécharger l'image
    downloadBtn.addEventListener('click', function() {
        const link = document.createElement('a');
        link.download = 'banner.png';
        link.href = canvas.toDataURL();
        link.click();
    });
});
