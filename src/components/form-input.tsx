import React, { useEffect, useState } from 'react';

const DATE_OPTIONS = {
    hour: 'numeric',
    minute: 'numeric',
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
};

export default function FormInput(props) {
    const {
        user,
        onInputSubmit
    } = props;

    const [email, setEmail] = useState(user.email || 'Email');
    const [value, setValue] = useState('');

    useEffect(() => {
        if (user) {
            setEmail(user.email);
        }
    }, [user]);

    const inputChange = (ev) => {
        setValue(ev.target.value);
    };

    const submitChange = () => {
        let currTime = new Date().toLocaleDateString('en-US', DATE_OPTIONS);
        let newMessage = {
            timestamp: currTime,
            email,
            value
        };
        if (value) onInputSubmit(newMessage);
        setValue('');
    };

    const handleKeyPress = (event) => {
        if (event.key !== 'Enter') return;
        event.preventDefault();
        submitChange();
    };

    return (
        <div>
            <form>
                <input
                    placeholder="enter text"
                    onChange={inputChange}
                    onKeyPress={handleKeyPress}
                    // onSubmit={(ev) => {
                    //   ev.preventDefault()
                    // }}
                    value={value} />
            </form>
        </div>
    );
}
