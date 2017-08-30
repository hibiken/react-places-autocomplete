const defaultStyles = {
  root: {
    position: 'relative',
    paddingBottom: '0px',
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    display: 'inline-block',
    width: '100%',
    padding: '10px',
  },
  closeIcon: {
    background: 'transparent',
    border: 'none',
    position: 'absolute',
    top: '0',
    bottom: '0',
    right: '5px',
    outline: 'none',
    fontSize: '30px',
  },
  autocompleteContainer: {
    position: 'absolute',
    top: '100%',
    backgroundColor: 'white',
    border: '1px solid #555555',
    width: '100%',
  },
  autocompleteItem: {
    backgroundColor: '#ffffff',
    padding: '10px',
    color: '#555555',
    cursor: 'pointer',
  },
  autocompleteItemActive: {
    backgroundColor: '#fafafa'
  },
  googleLogoContainer: {
    textAlign: 'right',
    padding: '1px',
    backgroundColor: '#fafafa'
  },
  googleLogoImage: {
    width: 150,
  },
}

export default defaultStyles
