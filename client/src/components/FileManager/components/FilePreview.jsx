import { useEffect, useState, useRef, useMemo } from 'react';

const DEFAULT_CONFIG = {
  maxPreviewSize: 524288000, // 500 MB
  supportedTypes: [
    'image/*',
    'video/*',
    'audio/*',
    'text/*',
    'application/pdf',
    'application/json'
  ]
};

const isTypeSupported = (mimeType, supportedTypes) => {
  return supportedTypes.some(type => {
    if (type.endsWith('/*')) {
      return mimeType.startsWith(type.slice(0, -1));
    }
    return type === mimeType;
  });
};

const getFileCategory = (mimeType) => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.startsWith('text/') || mimeType === 'application/json') return 'text';
  if (mimeType === 'application/pdf') return 'pdf';
  return 'unsupported';
};

// Componentes de vista previa
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

const PDFPreview = ({ url, fileName }) => (
  <iframe
    src={url}
    title={fileName}
    width="100%"
    height="600px"
    style={{ border: 'none' }}
  />
);

const TextPreview = ({ url, fileName }) => (
  <iframe
    src={url}
    title={fileName}
    width="100%"
    height="400px"
    style={{ border: 'none' }}
  />
);

const previewComponents = {
  image: ImagePreview,
  video: VideoPreview,
  audio: AudioPreview,
  pdf: PDFPreview,
  text: TextPreview
};

const PreviewRenderer = ({ category, url, fileName }) => {
  const Component = previewComponents[category];
  return Component ? <Component url={url} fileName={fileName} /> : null;
};

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
    if (!file?.mimeType || !file?.name) {
      setState('idle');
      return;
    }

    if (!isTypeSupported(file.mimeType, config.supportedTypes)) {
      setState('error');
      setError('Tipo de archivo no soportado para vista previa');
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

        cleanup();
        const url = URL.createObjectURL(blob);
        urlRef.current = url;
        setPreviewUrl(url);
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
    return <div>Selecciona un archivo para ver la vista previa</div>;
  }

  if (state === 'loading') {
    return (
      <div>
        <p>Cargando vista previa de <strong>{file.name}</strong>...</p>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div>
        <div style={{ color: '#d63031' }}>{error}</div>
        <button onClick={retry}>Reintentar</button>
      </div>
    );
  }

  if (state === 'success' && previewUrl) {
    const category = getFileCategory(file.mimeType);
    return (
      <div>
        <PreviewRenderer category={category} url={previewUrl} fileName={file.name} />
      </div>
    );
  }

  return null;
};

export default FilePreview;
