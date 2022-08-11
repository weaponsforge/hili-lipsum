const { Hilipsum } = require('../src/lib/classes/hilipsum')

// Example usage of the Hilipsum class
const main = () => {
  const hiLipsum = new Hilipsum()
  console.log(hiLipsum.lipsum())
}

main()
