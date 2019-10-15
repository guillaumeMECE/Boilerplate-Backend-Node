const { split, generateEmail, generateName, generateUsername, generatePassword, generateUrl, generateAccount } = require('./generateSeed');

describe('[CASE-0] - split ', () => {
    it('should return (hel,lo)', async () => {
        // Arrange

        // Act

        // Assert
        expect(split('hello')).toStrictEqual({ s1: 'hel', s2: 'lo' });
    });
    it('should return (to,to)', async () => {
        // Arrange

        // Act

        // Assert
        expect(split('toto')).toStrictEqual({ s1: 'to', s2: 'to' });
    });
});

describe('[CASE-1] - email ', () => {
    it('should return hel@lo.fr', () => {
        // Arrange

        // Act

        // Assert
        expect(generateEmail('hello')).toStrictEqual('hel@lo.fr');
    });
    it('should return to@to.fr', () => {
        // Arrange

        // Act

        // Assert
        expect(generateEmail('toto')).toStrictEqual('to@to.fr');
    });
});

describe('[CASE-2] - name ', () => {
    it('should return Hello', () => {
        // Arrange

        // Act

        // Assert
        expect(generateName('hello')).toStrictEqual('Hello');
    });
    it('should return Toto', () => {
        // Arrange

        // Act

        // Assert
        expect(generateName('Toto')).toStrictEqual('Toto');
    });
});

describe('[CASE-2] - username ', () => {
    it('should return hello-hello-123123', () => {
        // Arrange

        // Act

        // Assert
        expect(generateUsername('hello')).toStrictEqual('Hello-Hello-123123');
    });
    it('should return toto-toto-123123', () => {
        // Arrange

        // Act

        // Assert
        expect(generateUsername('toto')).toStrictEqual('Toto-Toto-123123');
    });
});
describe('[CASE-3] - password ', () => {
    it('should return hello', () => {
        // Arrange

        // Act

        // Assert
        expect(generatePassword('hello')).toStrictEqual('hello123123');
    });
    it('should return toto123123', () => {
        // Arrange

        // Act

        // Assert
        expect(generatePassword('toto')).toStrictEqual('toto123123');
    });
});

describe('[CASE-4] - url ', () => {
    it('should return hello.fr', () => {
        // Arrange

        // Act

        // Assert
        expect(generateUrl('hello')).toStrictEqual('hello.fr');
    });
    it('should return toto.fr', () => {
        // Arrange

        // Act

        // Assert
        expect(generateUrl('toto')).toStrictEqual('toto.fr');
    });
});


describe('[CASE-5] - account ', () => {
    it('should return hello.fr', () => {
        // Arrange

        // Act

        // Assert
        expect(generateAccount('hello').lastname).toStrictEqual('Hello');
    });
    it('should return toto.fr', () => {
        // Arrange

        // Act

        // Assert
        expect(generateAccount('toto').firstname).toStrictEqual('Toto');
    });
});
