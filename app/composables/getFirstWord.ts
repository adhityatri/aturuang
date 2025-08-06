const getFirstWord = (text: string) => {
  // Memeriksa apakah input adalah string yang valid
  if (typeof text !== 'string' || text.trim() === '') {
    return ''; // Mengembalikan string kosong jika input tidak valid
  }
  
  // Memecah teks berdasarkan spasi dan mengambil elemen pertama
  const words = text.split(' ');
  return words[0];
}

export default getFirstWord;