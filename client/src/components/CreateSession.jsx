import * as React from "react";
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";

import Layout from "./Layout";
import Select from "./Select";
import TextField from "./TextField";

import { roleOptions } from "../roles";
import { socket } from "../socket";

const CreateSession = () => {
  const { handleSubmit, register } = useForm();
  const history = useHistory();

  const onSubmit = (data) => {
    sessionStorage.setItem("name", data.name);
    sessionStorage.setItem("role", data.role);

    socket.emit("create session", (sessionCode) => {
      history.push(`/session/${sessionCode}`);
    });
  };

  return (
    <Layout>
      <form className="pt-3" onSubmit={handleSubmit(onSubmit)}>
        <h1>Create Session</h1>
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
