import * as React from 'react';
import { useHistory, useParams } from 'react-router-dom';

import Card from './Card';
import Layout from './Layout';

import { roles } from '../roles';
import { socket } from '../socket';

const points = ['XS', 'S', 'M', 'L', 'XL', '?'];

const Session = () => {
  const history = useHistory();
  const { sessionCode } = useParams();

  const [invalidSession, setInvalidSession] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [participants, setParticipants] = React.useState([]);
  const [vote, setVote] = React.useState(null);
  const [revealed, setRevealed] = React.useState(true);

  React.useEffect(() => {
    const name = sessionStorage.getItem('name');
    const role = sessionStorage.getItem('role');

    socket.emit('join session', name, role, sessionCode, () => {
      setInvalidSession(true);
      setLoading(false);
    });

    socket.on('refresh session', (sessionData) => {
      setParticipants(sessionData.members);
      setRevealed(sessionData.revealed);
      setLoading(false);
    });

    return () => {
      socket.removeAllListeners('refresh session');
    };
  }, [sessionCode]);

  const role = sessionStorage.getItem('role');

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
  }, [participants]);

  const onReset = () => {
    socket.emit('reset', sessionCode);
  };

  const onReveal = () => {
    socket.emit('reveal', sessionCode, () => {
      setRevealed(true);
    });
  };

  const onVote = (vote) => {
    setVote(vote);
    socket.emit('vote', vote, sessionCode);
  };

  const renderDevQAView = () => {
    return points.map((point, index, points) => {
      if (index % 2 === 0) {
        return (
          <div className="row mt-3" key={index}>
            <div className="col">
              <Card
                active={vote === points[index]}
                onClick={() => onVote(points[index])}
              >
                {points[index]}
              </Card>
            </div>
            <div className="col">
              <Card
                active={vote === points[index + 1]}
                onClick={() => onVote(points[index + 1])}
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
        <button
          className="btn btn-danger btn-block"
          onClick={() => history.goBack()}
        >
          Go Back
        </button>
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
                <small className="text-muted">
                  {roles[participant.role]?.label}
                </small>
              </div>
              <i
                className={`${
                  participant.role === roles.SCRUM_MASTER.value ||
                  participant.role === roles.PRODUCT_OWNER.value
                    ? 'bi-star text-warning'
                    : participant.vote
                    ? 'bi-check-circle text-success'
                    : 'bi-x-circle text-danger'
                }`}
              ></i>
            </li>
          ))}
        </ul>
        <button className="btn btn-primary btn-lg btn-block" onClick={onReveal}>
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
                  <h3>{participant.vote}</h3>
                </li>
              );
            }

            return null;
          })}
        </ul>
        <button className="btn btn-primary btn-lg btn-block" onClick={onReset}>
          Reset
        </button>
      </>
    );
  };

  if (loading) {
    return null;
  }

  return (
    <Layout>
      <div>
        {invalidSession ? (
          renderInvalidSessionView()
        ) : (
          <>
            <h1>Session {sessionCode}</h1>
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
