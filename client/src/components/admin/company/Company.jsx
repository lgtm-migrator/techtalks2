import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';

import InputField from '../../inputs/InputField';

const Company = props => {
  // const { bedriftID, navn, logo, sponsorType } = props;
  const [status, setStatus] = useState('default');
  const [edit, setEditing] = useState(false);
  const [eNavn, changeName] = useState('');
  const [eLogo, changeLogo] = useState('');
  const [eType, setSponsorship] = useState(0);

  const changeSponsorship = e => setSponsorship(parseInt(e.target.value));

  const allowEditing = () => {
    const { navn, logo, sponsorType } = props;
    changeName(navn);
    changeLogo(logo);
    setSponsorship(sponsorType);
    setEditing(true);
  }

  const cancelEditing = () => {
    this.setEditing(false);
  }

  const submitEdit = async () => {
    const token = localStorage.getItem('token');
    const { bedriftID, sponsorType, handleUpdate } = props;
    const req = {
      method: 'POST',
      body: JSON.stringify({
        token,
        bedriftID,
        navn: eNavn,
        logo: eLogo,
        oldSponsorType: sponsorType,
        sponsorType: eType,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const res = await fetch('/db/editCompany', req);
    const j = await res.json();
    const { status } = j;
    if (status === 'denied' || status === 'failed') {
      setStatus(status);
    } else {
      setStatus(status);
      setEditing(false);
      handleUpdate({Navn:eNavn,Logo:eLogo,eType});
    };
  }

  if (status === 'denied') {
    return <Redirect to="/admin" />;
  }
  const { bedriftID, sponsorType, navn, logo } = props;
  if (edit) {
    return (
      <tr>
        <td colSpan="4">
          <InputField
            label="Navn: "
            id={`company${bedriftID}Name`}
            updateValue={changeName}
            val={eNavn}
            type="text"
          />
          <InputField
            label="Logo: "
            id={`company${bedriftID}Logo`}
            updateValue={changeLogo}
            val={eLogo}
            type="text"
          />
          <label htmlFor={`company${bedriftID}Spons`}>
            Sponsor?
            <select value={eType} onChange={changeSponsorship}>
              <option value={0}>Nei</option>
              <option value={1}>Sølv</option>
              <option value={2}>Gull</option>
              <option value={3}>HSP</option>
            </select>
          </label>
          <button type="button" onClick={submitEdit}>
            Submit
          </button>
          <button type="button" onClick={cancelEditing}>
            Avbryt
          </button>
        </td>
      </tr>
    );
  }

  let sponsorName = null;
  if(sponsorType === 1) {
    sponsorName = 'Sølv';
  } else if (sponsorType === 2) {
    sponsorName = 'Gull';
  } else if (sponsorType === 3) {
    sponsorName = 'HSP';
  } else {
    sponsorName = 'Nei';
  }

  return (
    <tr>
      <td>{navn}</td>
      <td>{logo}</td>
      <td>{sponsorName}</td>
      <td>
        <button type="button" onClick={allowEditing}>
          Endre
        </button>
      </td>
    </tr>
  );
}

export default Company;