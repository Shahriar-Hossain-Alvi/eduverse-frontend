import PropTypes from 'prop-types';

const TanstackQueryErrorMessage = ({errorMessage}) => {
    return (
        <>  
            <p className="text-2xl text-error font-medium text-center">{errorMessage}</p>
        </>
    );
};

TanstackQueryErrorMessage.propTypes = {
    errorMessage: PropTypes.string
}

export default TanstackQueryErrorMessage;