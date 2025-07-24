import { useEffect, useState, useRef, useMemo } from 'react';

const DEFAULT_CONFIG = {
  maxPreviewSize: 524288000 // 500 MB
};

// ============================================================================
// - - P R E V I W    C O M P O N E N T S
// ============================================================================
const MessageContent = ({ text, children, color = '#888' }) => (
  <div style={{ textAlign: 'center', padding: '2rem', color }}>
    <div>{text}</div>
    {children}
  </div>
)

const ImagePreview = ({ url, fileName }) => (
  <img
    src={url}
    alt={fileName}
    style={{
      maxWidth: '100%',
      maxHeight: '70vh',
      display: 'block',
      margin: '0 auto'
    }}
  />
);

const VideoPreview = ({ url }) => (
  <video controls src={url} style={{ width: '100%', maxHeight: '70vh' }}>
    Tu navegador no soporta video.
  </video>
);

const AudioPreview = ({ url }) => (
  <audio controls src={url} style={{ width: '100%' }}>
    Tu navegador no soporta audio.
  </audio>
);

const IframePreview = ({ url, fileName }) => (
  <iframe
    src={url}
    title={fileName}
    width="100%"
    height="600px"
    style={{ border: 'none' }}
  />
);

const UnsupportedPreview = () => <MessageContent text="Visualizador no soportado para este tipo de archivo." />;

const previewComponents = {
  image: ImagePreview,
  video: VideoPreview,
  audio: AudioPreview,
  iframe: IframePreview,
  unsupported: UnsupportedPreview
};

// ============================================================================
// S U P P O R T
// ============================================================================
const extensionToMimeType = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  webp: 'image/webp',

  mp4: 'video/mp4',
  webm: 'video/webm',
  ogv: 'video/ogg',
  mov: 'video/quicktime',

  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  ogg: 'audio/ogg',
  m4a: 'audio/mp4',

  pdf: 'application/pdf',
  html: 'text/html',
  htm: 'text/html',
  txt: 'text/plain',
  json: 'application/json',
  xml: 'application/xml'
};

const getExtension = (fileName = '') => {
  const parts = fileName.split('.');
  return parts.length > 1 ? parts.pop().toLowerCase() : '';
};

const getFileCategory = (mimeType, fileName) => {
  const finalMime = mimeType || extensionToMimeType[getExtension(fileName)] || '';

  if (finalMime.startsWith('image/')) return 'image';
  if (finalMime.startsWith('video/')) return 'video';
  if (finalMime.startsWith('audio/')) return 'audio';
  if (
    finalMime === 'application/pdf' ||
    finalMime === 'text/plain' ||
    finalMime === 'text/html' ||
    finalMime === 'application/xml' ||
    finalMime === 'application/json'
  ) return 'iframe';

  return 'unsupported';
};

const PreviewRenderer = ({ category, url, fileName }) => {
  const Component = previewComponents[category] || UnsupportedPreview;
  return <Component url={url} fileName={fileName} />;
};

// ============================================================================
// - - M A I N   C O M P O N E N T
// ============================================================================
const FilePreview = ({
  file,
  loadFile,
  config: userConfig = DEFAULT_CONFIG
}) => {
  const [state, setState] = useState('idle'); // idle, loading, success, error
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);
  const urlRef = useRef(null);

  const config = useMemo(() => userConfig, [userConfig]);

  const cleanup = () => {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
  };

  useEffect(() => {
    if (!file?.name) {
      setState('idle');
      return;
    }

    if (file.size > config.maxPreviewSize) {
      setState('error');
      setError('Archivo muy grande para vista previa');
      return;
    }

    let isCancelled = false;
    setState('loading');
    setError(null);

    const loadPreview = async () => {
      try {
        const blob = await loadFile(file);
        if (!blob || isCancelled) return;

        const mimeType = file.mimeType || extensionToMimeType[getExtension(file.name)];
        const category = getFileCategory(mimeType, file.name);
        cleanup();

        if (category === 'iframe' && (mimeType.includes('xml') || mimeType.includes('html'))) {
          const blobToUse = new Blob([blob], { type: 'text/plain' });
          const url = URL.createObjectURL(blobToUse);
          urlRef.current = url;
          setPreviewUrl(url);
        } else {
          const url = URL.createObjectURL(blob);
          urlRef.current = url;
          setPreviewUrl(url);
        }

        setState('success');
      } catch (err) {
        if (!isCancelled) {
          setState('error');
          setError(err.message || 'Error al cargar el archivo');
        }
      }
    };

    loadPreview();

    return () => {
      isCancelled = true;
      cleanup();
    };
  }, [file, loadFile, config]);

  const retry = () => {
    if (file) {
      setState('loading');
      setError(null);
    }
  };

  if (!file) {
    return <MessageContent text="Selecciona un archivo para ver la vista previa" />
  }

  if (state === 'loading') {
    return <MessageContent text={<p>Cargando vista previa de <strong>{file.name}</strong>...</p>} />;
  }

  if (state === 'error') {
    return <MessageContent text={error} color='#d63031'><button onClick={retry}>Reintentar</button></MessageContent>;
  }

  if (state === 'success') {
    const mimeType = file.mimeType || extensionToMimeType[getExtension(file.name)];
    const category = getFileCategory(mimeType, file.name);
    return <PreviewRenderer category={category} url={previewUrl} fileName={file.name}/>;
  }

  return null;
};

export default FilePreview;
