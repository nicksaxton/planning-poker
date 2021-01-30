import * as React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';

import Layout from './Layout';
import Select from './Select';
import TextField from './TextField';

import { roleOptions } from '../roles';

const JoinSession = () => {
  const { handleSubmit, register } = useForm();
  const history = useHistory();

  const onSubmit = (data) => {
    sessionStorage.setItem('name', data.name);
    sessionStorage.setItem('role', data.role);

    history.push(`/session/${data.sessionCode}`);
  };

  return (
    <Layout>
      <form className="pt-3" onSubmit={handleSubmit(onSubmit)}>
        <h1>Join Session</h1>
        <TextField
          label="Your Name"
          name="name"
          ref={register({ required: true })}
        />
        <Select
          label="Your Role"
          name="role"
          options={roleOptions}
          ref={register}
        />
        <TextField
          label="Session Code"
          name="sessionCode"
          ref={register({ required: true })}
        />
        <button className="btn btn-primary btn-lg btn-block" type="submit">
          Join
        </button>
        <Link className="btn btn-secondary btn-lg btn-block" to="/">
          Cancel
        </Link>
      </form>
    </Layout>
  );
};

export default JoinSession;
