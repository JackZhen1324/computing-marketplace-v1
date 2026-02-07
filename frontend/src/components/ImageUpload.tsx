import { useState } from 'react';
import { Upload, message, Modal } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';

interface ImageUploadProps {
  value?: string;
  onChange?: (url: string) => void;
  maxCount?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, maxCount = 1 }) => {
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = async (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }

    if (info.file.status === 'done') {
      const url = info.file.response?.data?.url;
      if (url && onChange) {
        onChange(url);
      }
      setLoading(false);
      message.success('图片上传成功');
    }

    if (info.file.status === 'error') {
      setLoading(false);
      message.error('图片上传失败');
    }
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('只能上传图片文件');
      return false;
    }

    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('图片大小不能超过 10MB');
      return false;
    }

    return true;
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传图片</div>
    </button>
  );

  const uploadProps: UploadProps = {
    name: 'image',
    listType: 'picture-card',
    showUploadList: true,
    action: '/api/upload/image',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    beforeUpload,
    onChange: handleChange,
    onPreview: handlePreview,
    maxCount,
    className: 'image-uploader',
    fileList: value
      ? [
          {
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: value,
          },
        ]
      : [],
  };

  return (
    <>
      <Upload {...uploadProps}>{value ? null : uploadButton}</Upload>
      <Modal open={previewOpen} title="图片预览" footer={null} onCancel={() => setPreviewOpen(false)}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
      <style>{`
        .image-uploader .ant-upload-select {
          width: 128px;
          height: 128px;
        }
        .image-uploader .ant-upload-list-item-container {
          width: 128px;
          height: 128px;
        }
      `}</style>
    </>
  );
};

export default ImageUpload;
