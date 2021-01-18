import * as React from "react";
import { Link, useParams } from "react-router-dom";

import Card from "./Card";
import Layout from "./Layout";

import { roles } from "../roles";

const points = ["XS", "S", "M", "L", "XL", "?"];

const participants = [
  {
    name: "Nick",
    role: roles.DEVELOPER.value,
    voted: false,
  },
  {
    name: "Scott",
    role: roles.DEVELOPER.value,
    voted: true,
  },
  {
    name: "Brandon",
    role: roles.DEVELOPER.value,
    voted: false,
  },
  {
    name: "Chase",
    role: roles.PRODUCT_OWNER.value,
  },
  {
    name: "Justine",
    role: roles.QA.value,
    voted: true,
  },
  {
    name: "Tod",
    role: roles.SCRUM_MASTER.value,
  },
];

const Session = () => {
  const params = useParams();

  const [vote, setVote] = React.useState(null);
  const [revealed, setRevealed] = React.useState(true);

  const invalidSession = false;

  const role = roles.DEVELOPER.value;

  const sortedParticipants = React.useMemo(() => {
    return participants.sort((a, b) => {
      if (a.role !== b.role) {
        if (b.role === roles.SCRUM_MASTER.value) {
          return 1;
        } else if (
          b.role === roles.PRODUCT_OWNER.value &&
          a.role !== roles.SCRUM_MASTER.value
        ) {
          return 1;
        } else {
          return -1;
        }
      } else {
        return a.name.localeCompare(b.name);
      }
    });
  }, []);

  const renderDevQAView = () => {
    return points.map((point, index, points) => {
      if (index % 2 === 0) {
        return (
          <div className="row mt-3" key={index}>
            <div className="col">
              <Card
                active={vote === points[index]}
                onClick={() => setVote(points[index])}
              >
                {points[index]}
              </Card>
            </div>
            <div className="col">
              <Card
                active={vote === points[index + 1]}
                onClick={() => setVote(points[index + 1])}
              >
                {points[index + 1]}
              </Card>
            </div>
          </div>
        );
      } else {
        return null;
      }
    });
  };

  const renderInvalidSessionView = () => {
    return (
      <div className="alert alert-danger">
        <p>The session you are trying to join does not exist.</p>
        <Link className="btn btn-danger btn-block" to="/join">
          Go Back
        </Link>
      </div>
    );
  };

  const renderPOSMView = () => {
    return (
      <>
        <ul className="border list-group list-group-flush mb-2">
          {sortedParticipants.map((participant) => (
            <li
              className="list-group-item d-flex align-items-center justify-content-between"
              key={participant.name}
            >
              <div>
                <h5>{participant.name}</h5>
                <small>{roles[participant.role].label}</small>
              </div>
              <i
                className={`${
                  participant.role === roles.SCRUM_MASTER.value ||
                  participant.role === roles.PRODUCT_OWNER.value
                    ? "bi-star"
                    : participant.voted
                    ? "bi-check-circle"
                    : "bi-x-circle"
                }`}
              ></i>
            </li>
          ))}
        </ul>
        <button
          className="btn btn-primary btn-lg btn-block"
          onClick={() => setRevealed(true)}
        >
          Reveal
        </button>
      </>
    );
  };

  const renderRevealedView = () => {
    return (
      <>
        <ul className="border list-group list-group-flush mb-2">
          {sortedParticipants.map((participant) => {
            if (
              participant.role !== roles.PRODUCT_OWNER.value &&
              participant.role !== roles.SCRUM_MASTER.value
            ) {
              return (
                <li
                  className="list-group-item d-flex align-items-center justify-content-between"
                  key={participant.name}
                >
                  <div>
                    <h5>{participant.name}</h5>
                    <small>{roles[participant.role].label}</small>
                  </div>
                  <h3>XL</h3>
                </li>
              );
            }
          })}
        </ul>
        <button
          className="btn btn-primary btn-lg btn-block"
          onClick={() => setRevealed(false)}
        >
          Reset
        </button>
      </>
    );
  };

  return (
    <Layout>
      <div>
        {invalidSession ? (
          renderInvalidSessionView()
        ) : (
          <>
            <h1>Session {params.sessionCode}</h1>
            {revealed
              ? renderRevealedView()
              : role === roles.DEVELOPER.value || role === roles.QA.value
              ? renderDevQAView()
              : renderPOSMView()}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Session;
