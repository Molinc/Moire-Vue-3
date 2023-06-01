import defaultImageSrc from '@/assets/no-photo.jpg';

export default function colorsPhotosGallery(productColors, currentColorId) {
  const arr = [];

  productColors.forEach((item) => {
    let gallery;
    if (!item.gallery?.length || !item.gallery[0].file?.url) {
      gallery = [{ file: { url: defaultImageSrc } }];
    } else {
      gallery = item.gallery;
    }

    let photoNotChosen = true;
    const itemIsCurrent = item.color.id === currentColorId;

    let i = 0;
    gallery.forEach((photo) => {
      arr.push({
        id: `${item.color.id}/${i}-${photo.file.url}`,
        color: item.id,
        colorId: item.color.id,
        photo: photo.file.url,
        isCurrent: itemIsCurrent && photoNotChosen,
        colorCurrent: itemIsCurrent,
      });
      photoNotChosen = false; // проставляем текущим только первое фото
      i++;
    });
  });

  return arr;
}
