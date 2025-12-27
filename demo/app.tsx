import * as React from 'react';
import {Confirmer, promptConfirmation} from 'react-confirmation-box';
import {Button} from "../src/components/ui/button";

const App = () => {

    const handle = async () => {
        if (await promptConfirmation()) {
            console.log("confirmed");
        }
        else{
            console.log("cancelled");
        }
    }

    const handle2 = async () => {
        promptConfirmation().then(confirmed => {
            if (confirmed) {
                console.log("confirmed");
            }
            else{
                console.log("cancelled");
            }
        })
    }

    const handle3 = async () => {
        promptConfirmation({
            onConfirm: () => promptConfirmation().then(confirmed => {
                if (confirmed) {
                    console.log("confirmed 2");
                }
                else{
                    console.log("cancelled 2");
                }
            })
        }).then(confirmed => {
            if (confirmed) {
                console.log("confirmed 1");
            }
            else{
                console.log("cancelled 1");
            }
        })
    }

    return (
        <div>
            <h1 className="text-red-600">React Confirmation Box Demo</h1>
            <Button onClick={() => handle()}>Click to do something</Button>
            <br/>
            <Button onClick={() => handle2()}>Click to do something 2</Button>
            <br/>
            <Button onClick={() => handle3()}>Click to do something nested</Button>
            <Confirmer/>
        </div>
    );
};

export default App;
