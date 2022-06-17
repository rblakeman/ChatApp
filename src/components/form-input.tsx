import React, { useEffect, useState } from 'react';

import { NewMessage, User } from '../typings';

const DATE_OPTIONS = {
    hour: 'numeric',
    minute: 'numeric',
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
};

type FormInputProps = {
    user: User;
    onInputSubmit: (arg: NewMessage) => void;
};
export default function FormInput({
    user,
    onInputSubmit
}: FormInputProps) {
    const [email, setEmail] = useState(user.email || 'Email');
    const [value, setValue] = useState('');

    useEffect(() => {
        if (user) {
            setEmail(user.email);
        }
    }, [user]);

    const inputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setValue(ev.target.value);
    };

    const submitChange = () => {
        // @ts-expect-error FIXME
        let currTime = new Date().toLocaleDateString('en-US', DATE_OPTIONS);
        let newMessage = {
            timestamp: currTime,
            email,
            value
        };
        if (value) onInputSubmit(newMessage);
        setValue('');
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
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
