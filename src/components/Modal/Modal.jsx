import React, { useEffect } from 'react'
import { Overlay, ImageContainer, Image } from './Modal.styled'

export const Modal = ({unchooseImage, imageData}) => {
  
  const closeModal = (e) => {
    if (e.target === e.currentTarget) {
      unchooseImage()
    }
  }
  
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === "Escape") {
        unchooseImage()
      }
    }

    document.body.style.overflow = 'hidden';
    window.addEventListener("keydown", handleKeyPress)

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener("keydown", handleKeyPress)
    }
  }, [unchooseImage])

  const { largeImageURL, tags } = imageData
    
  return (
    <Overlay onClick={closeModal}>
      <ImageContainer>
        <Image src={largeImageURL} alt={tags} />
      </ImageContainer>
    </Overlay>
  )
}
