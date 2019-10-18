/**
 * Created by abradley on 28/03/2018.
 */

import React, { memo, useState, useRef, useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import SVGInline from 'react-svg-inline';

const img_data_init =
  '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="50px" height="50px"><g>' +
  '<circle cx="50" cy="0" r="5" transform="translate(5 5)"/>' +
  '<circle cx="75" cy="6.6987298" r="5" transform="translate(5 5)"/> ' +
  '<circle cx="93.3012702" cy="25" r="5" transform="translate(5 5)"/> ' +
  '<circle cx="100" cy="50" r="5" transform="translate(5 5)"/> ' +
  '<circle cx="93.3012702" cy="75" r="5" transform="translate(5 5)"/> ' +
  '<circle cx="75" cy="93.3012702" r="5" transform="translate(5 5)"/> ' +
  '<circle cx="50" cy="100" r="5" transform="translate(5 5)"/> ' +
  '<circle cx="25" cy="93.3012702" r="5" transform="translate(5 5)"/> ' +
  '<circle cx="6.6987298" cy="75" r="5" transform="translate(5 5)"/> ' +
  '<circle cx="0" cy="50" r="5" transform="translate(5 5)"/> ' +
  '<circle cx="6.6987298" cy="25" r="5" transform="translate(5 5)"/> ' +
  '<circle cx="25" cy="6.6987298" r="5" transform="translate(5 5)"/> ' +
  '<animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 55 55" to="360 55 55" dur="3s" repeatCount="indefinite" /> </g> ' +
  '</svg>';

const SummaryCmpd = memo(({ to_query, bondColorMap, currentVector, width, height }) => {
  const [img_data, setImg_data] = useState(img_data_init);
  const [isToggleOn, setIsToggleOn] = useState(false);
  const [old_url, setOld_url] = useState('');
  const base_url = window.location.protocol + '//' + window.location.host;
  const url = useRef('');
  const smiles = useRef('');

  const handleClick = () => {
    setIsToggleOn(!isToggleOn);
  };

  const loadFromServer = useCallback(() => {
    let get_params = {
      width,
      height
    };
    Object.keys(get_params).forEach(key => url.current.searchParams.append(key, get_params[key]));
    if (url.current.toString() !== old_url) {
      fetch(url.current)
        .then(response => response.text(), error => console.log('An error occurred.', error))
        .then(text => setImg_data(text));
    }
    setOld_url(url.current.toString());
  }, [height, old_url, width]);

  const getAtomIndices = useCallback(() => {
    if (currentVector === undefined) {
      return undefined;
    }
    if (bondColorMap === undefined) {
      return undefined;
    }
    let optionList = bondColorMap[currentVector];
    let outStrList = [];
    optionList.forEach(index => {
      let newList = [];
      optionList[index].forEach(newIndex => {
        if (optionList[index][newIndex] === 'NA') {
          newList.push(101);
        } else {
          newList.push(optionList[index][newIndex]);
        }
      });
      let newStr = newList.join(',');
      outStrList.push(newStr);
    });
    return outStrList.join(',');
  }, [bondColorMap, currentVector]);

  const update = useCallback(() => {
    let atomIndices = getAtomIndices();
    url.current = new URL(base_url + '/viewer/img_from_smiles/');
    let get_params;
    if (to_query === '') {
      smiles.current = to_query;
      return;
    } else if (atomIndices === undefined) {
      get_params = { smiles: to_query };
    } else {
      get_params = { smiles: to_query, atom_indices: atomIndices };
    }
    Object.keys(get_params).forEach(key => url.current.searchParams.append(key, get_params[key]));
    loadFromServer();
    smiles.current = to_query;
  }, [base_url, getAtomIndices, loadFromServer, to_query]);

  useEffect(() => {
    update();
  }, [update]);

  return (
    <div onClick={handleClick}>
      <SVGInline svg={img_data} />
    </div>
  );
});

function mapStateToProps(state) {
  return {
    to_query: state.selectionReducers.present.to_query,
    bondColorMap: state.selectionReducers.present.bondColorMap,
    currentVector: state.selectionReducers.present.currentVector
  };
}

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SummaryCmpd);
