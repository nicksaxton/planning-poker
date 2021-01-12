import * as React from "react";
import { Link } from "react-router-dom";

import Layout from "./Layout";
import Select from "./Select";
import TextField from "./TextField";

import { roleOptions } from "../roles";

const CreateSession = () => {
  return (
    <Layout>
      <form className="pt-3">
        <h1>Create Session</h1>
        <TextField label="Your Name" name="name" />
        <Select label="Your Role" name="role" options={roleOptions} />
        <button className="btn btn-primary btn-lg btn-block" type="submit">
          Create
        </button>
        <Link className="btn btn-secondary btn-lg btn-block" to="/">
          Cancel
        </Link>
      </form>
    </Layout>
  );
};

export default CreateSession;
