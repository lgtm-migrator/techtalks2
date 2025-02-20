import React, { useState } from 'react';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';

import { post } from '../../../utils/apiCalls.js';
import InputField from '../../inputs/InputField.jsx';

const Wrapper = styled.div`
  max-width: 50em;
  margin: auto;
  display: flex;
  flex-flow: column;
  align-items: center;
`;

const Img = styled.img`
  max-width: 10em;
`;

const Search = styled.div`
  display: flex;
  flex-flow: row wrap;
`;

const ImportCompany = (props) => {
  const [name, updateName] = useState('');
  const [status, setStatus] = useState('waiting');
  const [companies, setCompanies] = useState([]);

  const searchDotkom = async () => {
    await fetch(`https://online.ntnu.no/api/v1/companies?name=${name}`)
      .then((response) => {
        console.log(response);
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong');
        }
      })
      .then(({ results }) => {
        setStatus('loaded');
        setCompanies(results);
      });
  };

  const addCompany = async (index) => {
    const company = companies[index];
    const { name, image } = company;
    const { original } = image;
    const parts = original.split('/');
    const imageID = parts[parts.length - 1];
    const req = {
      body: JSON.stringify({
        navn: name,
        logo: imageID,
        lokaltBilde: false,
      }),
    };

    await post(`/admin/companies`, req).then((response) => {
      if (response.ok) {
        setStatus('success');
      }
    });
  };

  if (status === 'success') {
    return <Redirect to="/admin/companies" />;
  }
  return (
    <Wrapper>
      <h1>Importer et selskap fra Onlineweb</h1>
      <Search>
        <InputField label="Navn (case sensitive): " id="nameIn" val={name} type="text" updateValue={updateName} />
        <button type="button" onClick={searchDotkom}>
          Søk
        </button>
      </Search>

      {status === 'loaded' ? (
        <table>
          <thead>
            <tr>
              <th>Navn</th>
              <th>Bilde</th>
              <th>Legg til</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company, index) => (
              <tr key={index}>
                <td>{company.name}</td>
                <td>
                  <Img src={`https://online.ntnu.no${company.image.original}`} />
                </td>
                <td>
                  <button onClick={() => addCompany(index)}>Legg til</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </Wrapper>
  );
};

export default ImportCompany;
