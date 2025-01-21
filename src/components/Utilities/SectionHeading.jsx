import PropTypes from 'prop-types';


const SectionHeading = ({title}) => {
    return (

        <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl md:text-3xl font-bold">{title}</h3>
        </div>
    );
};

SectionHeading.propTypes = {
    title: PropTypes.string,
}

export default SectionHeading;