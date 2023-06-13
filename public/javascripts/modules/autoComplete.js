function autoComplete(input, latInput, lngInput) {
  //   skip this function from running if there's no address on the page
  if (!input) return;
  const dropdown = new google.maps.places.Autocomplete(input);
  dropdown.addListener('place_changed', () => {
    const place = dropdown.getPlace();
    latInput.value = place.geometry.location.lat();
    lngInput.value = place.geometry.location.lng();
  });
  //   If enter hit on address field, don't submit form
  input.on('keydown', (e) => {
    if (e.keyCode === 13) e.preventDefault();
  });
}

export default autoComplete;
