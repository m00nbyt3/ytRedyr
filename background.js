// Crear menú contextual al instalar la extensión
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "cleanYoutubeLink",
    title: "Abrir video sin lista",
    contexts: ["link", "page"],
    documentUrlPatterns: [
      "*://*.youtube.com/*",
      "*://youtu.be/*"
    ]
  });
});

// Función para limpiar la URL
function cleanYouTubeUrl(url) {
  try {
    const parsed = new URL(url);

    if ((parsed.hostname.includes("youtube.com") || parsed.hostname.includes("youtu.be"))
      &&
      parsed.pathname.includes("watch")) 
    {
      parsed.searchParams.delete("list");
      parsed.searchParams.delete("index");
      parsed.searchParams.delete("pp");
      return parsed.toString();
    }

    return null;
  } catch (e) {
    console.error("Error limpiando URL:", e);
    return null;
  }
}

// Manejar click del menú
chrome.contextMenus.onClicked.addListener((info, tab) => {
  let url = null;

  // Si hiciste click sobre un link
  if (info.linkUrl) {
    url = info.linkUrl;
  } else {
    // Si no, usa la URL de la pestaña actual
    url = tab.url;
  }

  if (!url) return;

  const cleanUrl = cleanYouTubeUrl(url);

  if (!cleanUrl) return;

  // Abrir en nueva pestaña
  chrome.tabs.create({
    url: cleanUrl
  });
});
