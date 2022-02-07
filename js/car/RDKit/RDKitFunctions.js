export const loadRDKit = () => {
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/@rdkit/rdkit/Code/MinimalLib/dist/RDKit_minimal.js';
  script.onload = () => {
    window
      .initRDKitModule()
      .then(function(RDKit) {
        console.log('RDKit version: ' + RDKit.version());
        window.RDKit = RDKit;
        /**
         * The RDKit module is now loaded.
         * You can use it anywhere.
         */
      })
      .catch(() => {
        // handle loading errors here...
      });
  };
  document.head.append(script);
};

export function checkmol(text) {
  if (text.length > 0) {
    var mol = window.RDKit.get_mol(text);
    if (mol.is_valid()) {
      return mol;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

export function getsvg(mol) {
  var svg = mol.get_svg();
  return svg;
}

export function comparesmiles(mol1, mol2) {
  var smiles1 = mol1.get_smiles();
  var smiles2 = mol2.get_smiles();

  if (smiles1 === smiles2) {
    return true;
  } else {
    return false;
  }
}
