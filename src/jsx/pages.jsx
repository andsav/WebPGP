const pages = [
    {
        name: "Generate",
        form: (
            <Form
                submit="Generate Key Pair"
                submitFunction={(data, cb) => {
                    let options = {
                        userIds: [{ name: data.name, email: data.email }],
                        numBits: 2048
                    };

                    if(data.passphrase !== "") {
                        options["passphrase"] = data.passphrase;
                    }

                    window.openpgp.generateKey(options).then(
                        (key) => {
                            cb(
                                <div className="row">
                                    <div className="column">
                                        <Pre>{key.privateKeyArmored}</Pre>
                                    </div>
                                    <div className="column">
                                        <Pre>{key.publicKeyArmored}</Pre>
                                    </div>
                                </div>
                            );
                        }
                    );
                }}>
                <Row>
                    <Column>
                        <Input name="Name" type="text" placeholder="Full name" required />
                        <Input name="Email" type="email" placeholder="Email address" required/>
                    </Column>
                    <Column>
                        <Input name="Passphrase" type="password" placeholder="RECOMMENDED" />
                        <Input name="Comment" type="text" />
                    </Column>
                </Row>
            </Form>
        )
    },
    {
        name: "Encrypt",
        form: (
            <Form
                submit="Encrypt"
                submitFunction = {(data, cb) => {
                    let options = {
                        data: data.message,
                        publicKeys: window.openpgp.key.readArmored(data["public-key"]).keys
                    };

                    window.openpgp.encrypt(options).then(
                        (ciphertext) => {
                            cb(
                                <div className="row">
                                    <div className="column">
                                        <Pre>{ciphertext.data}</Pre>
                                    </div>
                                </div>
                            )
                        }
                    );
                }}>
                <Row>
                    <Column>
                        <Textarea name="Message" placeholder="Message" required />
                    </Column>
                    <Column>
                        <Textarea name="Public Key" placeholder="PGP Public Key" required />
                    </Column>
                </Row>
            </Form>
        )
    },
    {
        name: "Decrypt",
        form: (
            <Form
                submit="Decrypt"
                submitFunction = {(data, cb) => {
                    let key = window.openpgp.key.readArmored(data["private-key"]).keys[0];
                    let options = {
                        message: window.openpgp.message.readArmored(data["encrypted-message"]),
                        privateKey: key
                    };
                    let ret = (plaintext) => {
                        cb(
                            <div className="row">
                                <div className="column">
                                    <Pre>{plaintext.data}</Pre>
                                </div>
                            </div>
                        )
                    };
                    let err = (message) => {
                        return () => { cb ( <Error message={message} /> ) };
                    };

                    if(key.primaryKey.isDecrypted) {
                        window.openpgp
                            .decrypt(options)
                            .then(ret)
                            .catch(err("Invalid parameters"));
                    }
                    else {
                        window.openpgp.decryptKey({
                            privateKey: key,
                            passphrase: data.passphrase
                        }).then( (dec) => {
                            options["privateKey"] = dec;

                            window.openpgp
                                .decrypt(options)
                                .then(ret)
                                .catch(err("Invalid parameters"));

                        }).catch(err("Invalid passphrase"));
                    }
                }}>
                <Row>
                    <Column>
                        <Textarea name="Encrypted Message" placeholder="Encrypted Message" required />
                    </Column>
                    <Column name="Private Key">
                        <Textarea name="Private Key" placeholder="PGP Private Key" required />
                    </Column>
                </Row>
                <Row>
                    <Column>
                        <Input name="Passphrase" type="password" />
                    </Column>
                </Row>
            </Form>
        )
    }
];
