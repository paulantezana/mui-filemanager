import { useEffect, useState, useRef, useMemo } from 'react';

const DEFAULT_CONFIG = {
  maxPreviewSize: 524288000 // 500 MB
};

// ============================================================================
// - - P R E V I W    C O M P O N E N T S
// ============================================================================
const MessageContent = ({ text, children, color = '#888' }) => (
  <div className='h-full w-full flex column items-center justify-center' style={{ padding: '.5rem', color }}>
    <div>{text}</div>
    {children}
  </div>
)

const ImagePreview = ({ url, cover, fileName }) => (
  <img
    src={url}
    alt={fileName}
    style={{
      display: 'block',
      margin: '0 auto',
      ...(!cover && {
        maxHeight: '70vh',
        maxWidth: '100%',
      }),
      ...(cover && {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
      }),
    }}
  />
);

const VideoPreview = ({ url, cover }) => (
  <video controls={!cover} src={url} style={{ width: '100%', maxHeight: '70vh' }}>
    Tu navegador no soporta video.
  </video>
);

const AudioPreview = ({ url, cover }) => (
  <audio controls={!cover} src={url} style={{ width: '100%' }}>
    Tu navegador no soporta audio.
  </audio>
);

const IframePreview = ({ url, fileName }) => (
  <iframe
    src={url}
    title={fileName}
    width="100%"
    height="100%"
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

  mp4: 'application/mp4',
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
  if (finalMime.startsWith('application/mp4')) return 'video';
  if (
    finalMime === 'application/pdf' ||
    finalMime === 'text/plain' ||
    finalMime === 'text/html' ||
    finalMime === 'application/xml' ||
    finalMime === 'application/json'
  ) return 'iframe';

  return 'unsupported';
};

const PreviewRenderer = ({ category, cover, url, fileName }) => {
  const Component = previewComponents[category] || UnsupportedPreview;
  return <Component url={url} cover={cover} fileName={fileName} />;
};

// ============================================================================
// - - M A I N   C O M P O N E N T
// ============================================================================
const FileViewer = ({
  file,
  loadFile,
  config: userConfig = DEFAULT_CONFIG,
  cover = false,
}) => {
  const [state, setState] = useState('idle'); // idle, loading, success, error
  const [preview, setPreview] = useState({ url: null, file: null });
  const urlRef = useRef(null);
  const [error, setError] = useState(null);

  const config = useMemo(() => userConfig, [userConfig]);

  const cleanup = () => {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current); // Liberar memoria
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
      setError('El archivo es demasiado grande para verlo');
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

        const url = category === 'iframe' && (mimeType.includes('html') || mimeType.includes('xml'))
          ? URL.createObjectURL(new Blob([blob], { type: 'text/plain' }))
          : URL.createObjectURL(blob);

        urlRef.current = url;

        setPreview({ url, file }); // Se guarda el file asociado al URL
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

  if (!file) {
    return <MessageContent text="Not fount" />
  }

  if (state === 'loading') {
    return <MessageContent text="Cargando..." />;
  }

  if (state === 'error') {
    return <MessageContent text={error} color='#d63031' />;
  }

  if (state === 'success' && preview.url && preview.file?.id === file.id) {
    const mimeType = file.mimeType || extensionToMimeType[getExtension(file.name)];
    const category = getFileCategory(mimeType, file.name);
    return <PreviewRenderer category={category} cover={cover} url={preview.url} fileName={file.name} />;
  }

  return <MessageContent text="Renderizando..." />;
};

export default FileViewer;
