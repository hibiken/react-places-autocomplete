const defaultStyles = {
  root: {
    position: 'relative',
    paddingBottom: '0px',
  },
  input: {
    display: 'inline-block',
    width: '100%',
    padding: '10px',
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
  autocompleteDescription: {
    position: 'absolute',
    clip: 'rect(1px 1px 1px 1px)', /* IE6, IE7 */
    clip: 'rect(1px, 1px, 1px, 1px)',
    padding: '0',
    border: '0',
    height: '1px',
    width: '1px',
    overflow: 'hidden',
  }
}

export default defaultStyles
