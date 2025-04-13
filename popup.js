// Tu API Key de Pastebin
const PASTEBIN_API_KEY = 'McewBTItXFGWHAq_ST2GKEep7Yv_m1Ex'; // Reemplaza con tu API Key

document.getElementById('addAnnotation').addEventListener('click', () => {
  const annotation = document.getElementById('annotation').value;
  if (annotation.trim() === '') {
    alert('Por favor, escribe una nota.');
    return;
  }

  const timestamp = new Date().toLocaleTimeString();
  addAnnotationToList(annotation, timestamp);

  // Limpiar el textarea después de añadir la anotación
  document.getElementById('annotation').value = '';
});

function addAnnotationToList(annotation, timestamp) {
  const annotationList = document.getElementById('annotationList');

  const annotationItem = document.createElement('div');
  annotationItem.classList.add('annotation-item');

  const annotationText = document.createElement('div');
  annotationText.textContent = annotation;

  const annotationTimestamp = document.createElement('div');
  annotationTimestamp.classList.add('timestamp');
  annotationTimestamp.textContent = `Agregado el: ${timestamp}`;

  const shareButton = document.createElement('button');
  shareButton.textContent = 'Compartir';
  shareButton.classList.add('share-button');
  shareButton.addEventListener('click', async () => {
    try {
      // Enviar la anotación a Pastebin
      const pasteUrl = await sendToPastebin(annotation);
      
      // Mostrar el enlace generado
      const shareLink = document.createElement('div');
      shareLink.classList.add('share-link');
      shareLink.innerHTML = `<a href="${pasteUrl}" target="_blank">${pasteUrl}</a>`;

      // Botón para copiar el enlace
      const copyButton = document.createElement('button');
      copyButton.textContent = 'Copiar enlace';
      copyButton.classList.add('share-button');
      copyButton.style.marginTop = '5px';
      copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(pasteUrl).then(() => {
          alert('Enlace copiado al portapapeles.');
        }).catch(() => {
          alert('No se pudo copiar el enlace.');
        });
      });

      // Agregar el enlace y el botón de copiar
      annotationItem.appendChild(shareLink);
      annotationItem.appendChild(copyButton);
    } catch (error) {
      alert('Error al compartir la nota. Intentalo de nuevo.');
      console.error(error);
    }
  });

  annotationItem.appendChild(annotationText);
  annotationItem.appendChild(annotationTimestamp);
  annotationItem.appendChild(shareButton);
  annotationList.appendChild(annotationItem);
}

async function sendToPastebin(text) {
  const url = 'https://pastebin.com/api/api_post.php';
  const data = new URLSearchParams();
  data.append('api_dev_key', PASTEBIN_API_KEY);
  data.append('api_option', 'paste');
  data.append('api_paste_code', text);
  data.append('api_paste_name', 'Nota de YouTube'); // Nombre del paste
  data.append('api_paste_format', 'text'); // Formato del texto
  data.append('api_paste_private', '0'); // 0 = público, 1 = no listado, 2 = privado
  data.append('api_paste_expire_date', '1W'); // Expira en 1 semana (opcional)

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: data,
  });

  if (!response.ok) {
    throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
  }

  const result = await response.text();
  if (result.startsWith('Bad API request')) {
    throw new Error(`Error de Pastebin: ${result}`);
  }

  return result; // Retorna la URL del paste
}