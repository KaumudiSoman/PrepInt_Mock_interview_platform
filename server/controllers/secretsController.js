exports.getSecrets = async(req, res) => {
    try {
        const secrets = {
            VAPI_PUBLIC_API_KEY: process.env.VAPI_PUBLIC_API_KEY,
            VAPI_WORKFLOW_ID: process.env.VAPI_WORKFLOW_ID
        }

        return res.status(200).json({
            status: 'success',
            data: secrets
        });
    }
    catch (error) {
        return res.status(500).json({
            status: 'fail',
            error: error.message
        });
    }
};