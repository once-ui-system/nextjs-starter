import React, { useRef, useState, forwardRef, useEffect } from 'react';
import classNames from 'classnames';
import Compressor from 'compressorjs';
import { Flex, Icon, SmartImage, Spinner, Text } from '@/once-ui/components';
import styles from './MediaUpload.module.scss';

interface MediaUploadProps {
    onFileUpload?: (file: File) => Promise<void>;
    compress?: boolean;
    minHeight?: number;
    aspectRatio?: string;
    className?: string;
    style?: React.CSSProperties;
    initialPreviewImage?: string | null;
    quality?: number;
    maxWidth?: number;
    convertTypes?: string[];
    maxHeight?: number;
    loading?: boolean;
    width?: number;
    height?: number;
    accept?: string;
}

const MediaUpload = forwardRef<HTMLInputElement, MediaUploadProps>(({
    onFileUpload,
    compress = true,
    minHeight,
    aspectRatio = '16 / 9',
    quality = 0.8,
    maxWidth = 1920,
    convertTypes = ['image/png', 'image/webp', 'image/jpg'],
    maxHeight = 1920,
    width = 1200,
    height = 1200,
    loading = false,
    className,
    style,
    initialPreviewImage = null,
    accept = 'image/*'
}, ref) => {
        const [dragActive, setDragActive] = useState(false);
        const [previewImage, setPreviewImage] = useState<string | null>(initialPreviewImage); // Use prop as initial state
        const [uploading, setUploading] = useState(false);
        const inputRef = useRef<HTMLInputElement>(null);

        useEffect(() => {
            if (initialPreviewImage) {
                setPreviewImage(initialPreviewImage);
            }
        }, [initialPreviewImage]);

        const handleDragOver = (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(true);
        };

        const handleDragLeave = (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);
        };

        const handleDrop = (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);

            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                handleFiles(e.dataTransfer.files);
            }
        };

        const handleFileSelection = () => {
            if (inputRef.current) {
                inputRef.current.click();
            }
        };

        const handleFiles = (files: FileList) => {
            const file = files[0];
            if (!file) return;

            if (file.type.startsWith('image/')) {
                setPreviewImage(URL.createObjectURL(file));

                if (compress && file.type.startsWith('image/')) {
                    compressImage(file);
                } else {
                    uploadFile(file);
                }
            } else {
                console.warn('Unsupported file type:', file.type);
            }
        };

        const compressImage = (file: File) => {
            new Compressor(file, {
                convertTypes: convertTypes,
                quality: quality,
                maxWidth: maxWidth,
                maxHeight: maxHeight,
                width: width,
                height: height,
                success(compressedFile) {
                    uploadFile(compressedFile as File);
                },
                error(err) {
                    console.error('Compression error:', err);
                    uploadFile(file);
                },
            });
        };

        const uploadFile = async (file: File) => {
            setUploading(true);
            if (onFileUpload) {
                await onFileUpload(file);
            }
            setUploading(false);
        };

        return (
            <Flex fillWidth fillHeight
                className={classNames(styles['image-upload-container'], className, { 'drag-active': dragActive })}
                style={style}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}>
                <Flex
                    position="relative"
                    className={styles.container}
                    style={{ aspectRatio: aspectRatio }}
                    fillWidth
                    justifyContent="center" alignItems="center"
                    border="neutral-medium" borderStyle="solid-1" radius="l"
                    onClick={handleFileSelection}>
                    { !loading && (
                        <>
                            { previewImage ? (
                                <SmartImage
                                    style={{
                                        cursor: 'pointer',
                                        filter: uploading ? 'grayscale(1)' : ''
                                    }}
                                    aspectRatio={aspectRatio}
                                    src={previewImage ? previewImage : ''}
                                    alt="Preview of uploaded image"
                                />
                            ) : (
                                <Flex fillWidth minHeight={minHeight}
                                    alignItems="center" justifyContent="center">
                                    <Icon name="plus" size="l" />
                                </Flex>
                            )}
                        </>
                    )}
                    <Flex
                        className={styles.upload}
                        zIndex={1}
                        position="absolute"
                        fillWidth fillHeight padding="m"
                        justifyContent="center" alignItems="center">
                        {uploading || loading ? (
                            <Spinner size="l" />
                        ) : (
                            <Text className={styles.text} align="center">
                                Drag and drop or click to browse
                            </Text>
                        )}
                    </Flex>
                </Flex>

                <input
                    type="file"
                    ref={inputRef}
                    accept={accept}
                    style={{ display: 'none' }}
                    onChange={(e) => {
                        if (e.target.files) {
                            handleFiles(e.target.files);
                        }
                    }}
                />
            </Flex>
        );
    }
);

MediaUpload.displayName = 'MediaUpload';
export { MediaUpload };