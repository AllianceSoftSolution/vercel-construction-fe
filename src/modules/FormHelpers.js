const OnInputPhone=(e) => {
    let value = e.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    value = value.slice(0, 10); // Limit maximum length to 12 characters

    if (value.length > 3) {
      value = value.slice(0, 3) + '-' + value.slice(3);
    }
    if (value.length > 7) {
      value = value.slice(0, 7) + '-' + value.slice(7);
    }

    e.target.value = value;
  }
  const getRandomColor = () => {
    return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
      Math.random() * 256
    )}, ${Math.floor(Math.random() * 256)})`
  }

  export {OnInputPhone,getRandomColor}