import { useState, useEffect } from 'react';

import { ImageGallery } from './ImageGallery/ImageGallery';
import { Searchbar } from './Searchbar/Searchbar';
import { Button } from './Button/Button';
import { Modal } from './Modal/Modal';
import { Loader } from './Loader/Loader';
import { ErrorMessage } from './Error/Error'

import { fetchImages } from './services/api';

import css from './App.module.css'

export const App = () => {
  const [images, setImages] = useState([])
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [canLoad, setCanLoad] = useState(false)
  const [error, setError] = useState('')
  const [isImageChosen, setIsImageChosen] = useState(false)
  const [imageData, setImageData] = useState({})

  const handleSearch = async (keyword) => {
    setKeyword(keyword)
    setPage(1)
    setImages([])
  }  

  useEffect(() => {
    if (keyword) {
      try {
        setIsLoading(true)
        setError('')
        const fetchData = async () => {
          const searchedData = await fetchImages(keyword, page);

          const searchedImages = searchedData.data.hits.map(image => {
            return { id: image.id, largeImageURL: image.largeImageURL, webformatURL: image.webformatURL, tags: image.tags }
          })

          setIsLoading(false)
          setCanLoad(page < Math.ceil(searchedData.data.totalHits / 12))
          setImages((prev) => [...prev, ...searchedImages])
        }

        fetchData()
      } catch (error) {
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }
  }, [keyword,page])


  const handleLoadMore = () => {
    setPage((page) => page + 1)
  }

  const openModal = (imageData) => {
    setIsImageChosen(true)
    setImageData(imageData)
  }

  const unchooseImage = () => {
    setIsImageChosen(false)
    setImageData({})
  }

    return (
      <div className={css.appcontainer}>
        <Searchbar handleSearch={handleSearch} />
        {images.length > 0 && <ImageGallery galleryData={images} openModal={openModal} />}
        {isLoading && <Loader />}
        {error && <ErrorMessage error={error}/>}
        {canLoad && <Button handleLoadMore={handleLoadMore} />}
        {isImageChosen && <Modal imageData={imageData} unchooseImage={unchooseImage} />}
      </div>
    );
};
