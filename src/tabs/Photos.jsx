import { useEffect, useLayoutEffect, useState } from 'react';
import Form from '../components/Form/Form';
import Text from '../components/Text/Text';
import PhotosGallery from '../components/PhotosGallery/PhotosGallery';
import Button from '../components/Button/Button';
import { getPhotos } from '../apiService/photos';
import Loader from '../components/Loader/Loader';
import { ImageModal } from '../components/ImageModal/ImageModal';

const Photos = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState(null);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalSrc, setModalSrc] = useState('');
  const [modalAlt, setModalAlt] = useState('');

  useEffect(() => {
    if (!query) {
      return;
    }
    const fetchImages = async () => {
      setIsLoading(true);
      try {
        const { photos, per_page, total_results } = await getPhotos(
          query,
          page
        );
        console.log('photos', photos);
        if (!photos.length) {
          return setIsEmpty(true);
        }
        setImages(prevImages => [...prevImages, ...photos]); //prevImages === images найактуальніший на дану сек часу
        setIsVisible(page < Math.ceil(total_results / per_page));
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchImages();
  }, [page, query]);

  const onHandleSubmit = value => {
    setQuery(value);
    setImages([]);
    setError(null);
    setIsEmpty(false);
    setIsVisible(false);
    setPage(1);
  };

  const onLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };
  const openModal = (src, alt) => {
    setIsOpen(true);
    setModalSrc(src);
    setModalAlt(alt);
  };
  const closeModal = () => {
    setIsOpen(false);
    setModalSrc('');
    setModalAlt('');
  };
  return (
    <>
      <Form onSubmit={onHandleSubmit} />
      {images.length > 0 && (
        <PhotosGallery images={images} openModal={openModal} />
      )}
      {isVisible && (
        <Button onClick={onLoadMore} disabled={isLoading}>
          {isLoading ? ' Loading...' : 'Load more'}
        </Button>
      )}
      {!images.length && !isEmpty && !error && (
        <Text textAlign="center">Let`s begin search 🔎</Text>
      )}
      {isLoading && <Loader />}

      {error && <Text textAlign="center">❌Something went wrong</Text>}
      {isEmpty && (
        <Text textAlign="center">Sorry. There are no images... 😭</Text>
      )}
      <ImageModal
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        src={modalSrc}
        alt={modalAlt}
      />
    </>
  );
};

export default Photos;
