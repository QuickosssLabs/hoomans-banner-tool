
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('load-nft-btn').addEventListener('click', loadNFTs);

    const nftIdInput = document.getElementById('nft-id');
    const loadNftBtn = document.getElementById('load-nft-btn');
    const downloadBtn = document.getElementById('downloadBtn');
    const textInput = document.getElementById('banner-text');
    const canvas = document.getElementById('banner-canvas');
    const ctx = canvas.getContext('2d');
    const backgroundThumbnails = document.getElementById('background-thumbnails');
    const backgroundImage = new Image();
    


    // Charger un NFT via OpenSea API
    loadNftBtn.addEventListener('click', loadNFTs);

    // Charger l'image de fond
    backgroundImage.src = 'images/background/banner-background1.png'; // Valeur par défaut

    // Événement pour gérer le clic sur les vignettes
    backgroundThumbnails.addEventListener('click', function(event) {
        const target = event.target.closest('.thumbnail');
        if (target) {
            const selectedImage = target.getAttribute('data-image');
            backgroundImage.src = selectedImage; // Charger l'image de fond sélectionnée
            drawVisibleBanner(); // Redessiner le canevas avec la nouvelle image de fond
        }
    });

    // Charger l'image de fond au démarrage
    backgroundImage.onload = () => {
        drawVisibleBanner();
    };

    // Redessiner le canevas avec la nouvelle image de fond
    backgroundImage.onload = () => {
        drawVisibleBanner();
    };


    // Variable pour stocker l'image NFT
    let nftImage = null;
    let nftMetadata = null; // Pour stocker les métadonnées du NFT

    // Charger l'image de fond au démarrage
    backgroundImage.onload = () => {
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
                return colorMapBase[baseTrait.value] || "#7461bd"; // Utilise la couleur du trait "Base" ou par défaut
            }
        }

        return "#7461bd";;  
    }

    function loadNFTs() {
        const apiKey = '3a0bb7983c7841e6a0770e39305fa084'; // Remplace par ta clé API OpenSea
        const contractAddress = '0xbe3c7aBaB76F0a1dE602fDB2f44faF604a5F649F'; // Adresse du contrat
    
        // Récupérer les champs d'entrée pour les NFT
        const nftInputs = document.querySelectorAll('.nft-id');
    
        // Initialiser un compteur pour la position horizontale
        let nftCount = 0; // Compteur pour suivre le nombre de NFTs chargés
    
        nftInputs.forEach(input => {
            const tokenId = input.value.trim(); // Récupère l'ID du NFT en supprimant les espaces
            if (!tokenId) {
                console.error('Token ID is empty.');
                return; // Ignore les champs vides
            }
    
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
                    const bgColor = getBackgroundColor(data.nft); // Obtenir la couleur de fond à partir des métadonnées
    
                    const tempNftImage = new Image(); // Correctement défini ici
                    tempNftImage.crossOrigin = "Anonymous";
                    tempNftImage.src = data.nft.image_url;
    
                    tempNftImage.onload = () => {
                        const transparentNftImage = removeBackgroundColor(tempNftImage, bgColor); // Supprimer le fond
    
                        // Ajoute l'image NFT avec fond supprimé au canevas
                        drawNftOnCanvas(transparentNftImage, nftCount); // Passe le compteur en paramètre
                        nftCount++; // Incrémente le compteur après avoir dessiné le NFT
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
        });
    }
    
    
    function drawNftOnCanvas(img, index) {
        const canvas = document.getElementById('banner-canvas');
        const ctx = canvas.getContext('2d');
    
        const positions = [
            { x: 180, y: 110, width: 400, height: 400 }, // NFT 1
            { x: 940, y: 200, width: 340, height: 340 }, // NFT 2
            { x: 1100, y: 75, width: 425, height: 425 }, // NFT 3
            { x: 0, y: 190, width: 330, height: 330 },  // NFT 4
            { x: 500, y: 190, width: 320, height: 320 }, // NFT 5
            { x: 720, y: 160, width: 340, height: 340 }, // NFT 6
        ];
    
        if (index < positions.length) {
            // Ne pas effacer le canvas ici
            ctx.drawImage(img, positions[index].x, positions[index].y, positions[index].width, positions[index].height);
        }
    }

    
    
    
    //remove background color from nft

    function removeBackgroundColor(image, bgColorHex) {
        const offScreenCanvas = document.createElement('canvas');
        const offScreenCtx = offScreenCanvas.getContext('2d');
    
        offScreenCanvas.width = image.width;
        offScreenCanvas.height = image.height;
    
        offScreenCtx.drawImage(image, 0, 0);
    
        const imageData = offScreenCtx.getImageData(0, 0, image.width, image.height);
        const data = imageData.data;
    
        const bgColor = hexToRgb(bgColorHex); // Convertir le code hex en RGB
    
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
    
            // Si la couleur est proche de la couleur de fond, rendre transparent
            if (isSimilarColor(r, g, b, bgColor)) {
                data[i + 3] = 0; // Mettre l'alpha à 0 (transparent)
            }
        }
    
        offScreenCtx.putImageData(imageData, 0, 0);
        return offScreenCanvas;
    }
    
    // Convertir hex en RGB
    function hexToRgb(hex) {
        const bigint = parseInt(hex.slice(1), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return { r, g, b };
    }
    
    // Vérifier si une couleur est similaire à celle de l'arrière-plan
    function isSimilarColor(r, g, b, bgColor, tolerance = 5) {
        return Math.abs(r - bgColor.r) < tolerance && 
               Math.abs(g - bgColor.g) < tolerance && 
               Math.abs(b - bgColor.b) < tolerance;
    }
    

    function drawVisibleBanner() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Dessiner l'image de fond
        if (backgroundImage.complete) {
            ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        }
    }


    // Fonction pour télécharger l'image
    downloadBtn.addEventListener('click', function() {
        const link = document.createElement('a');
        link.download = 'banner.png';
        link.href = canvas.toDataURL();
        link.click();
    });
});
