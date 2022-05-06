import { makeStyles, Tooltip, Typography } from '@material-ui/core';
import React from 'react';
import { DialogSection } from '../../../../../common/components/DialogSection';
import { DialogSectionHeading } from '../../../../../common/components/DialogSectionHeading';
import PubChem from '../../../../../assets/pubchem.svg';
import PubChemSafety from '../../../../../assets/pubchem-safety.svg';

const useStyles = makeStyles(theme => ({
  sections: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)'
  }
}));

export const ProductSection = ({ product }) => {
  const classes = useStyles();

  const productpubcheminfo = product.productpubcheminfo || {};

  return (
    <DialogSection>
      <DialogSectionHeading>Product</DialogSectionHeading>
      <div className={classes.sections}>
        <div>
          <Typography>
            Smiles: <strong>{product.smiles}</strong>
          </Typography>
          {productpubcheminfo.cas && (
            <Typography>
              CAS number: <strong>{productpubcheminfo.cas}</strong>
            </Typography>
          )}
        </div>

        {!!productpubcheminfo.compoundsummarylink && (
          <div>
            <Tooltip title="PubChem compound summary">
              <a href={productpubcheminfo.compoundsummarylink} target="_blank" rel="noreferrer">
                <img src={PubChem} height={50} />
              </a>
            </Tooltip>
          </div>
        )}
        {!!productpubcheminfo.lcsslink && (
          <div>
            <Tooltip title="Laboratory chemical safety summary">
              <a href={productpubcheminfo.lcsslink} target="_blank" rel="noreferrer">
                <img src={PubChemSafety} height={50} />
              </a>
            </Tooltip>
          </div>
        )}
      </div>
    </DialogSection>
  );
};
