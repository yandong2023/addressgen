import { faker } from '@faker-js/faker';

const HOBBIES = [
    'Reading', 'Gaming', 'Cooking', 'Photography', 'Traveling',
    'Music', 'Sports', 'Painting', 'Dancing', 'Gardening'
];

const OCCUPATIONS = [
    'Software Engineer', 'Teacher', 'Doctor', 'Designer', 'Chef',
    'Lawyer', 'Artist', 'Accountant', 'Manager', 'Entrepreneur'
];

const TAX_FREE_STATES = {
    'Alaska': 'AK',
    'Delaware': 'DE',
    'Montana': 'MT',
    'New Hampshire': 'NH',
    'Oregon': 'OR'
};

const COUNTRY_CONFIGS = {
    US: {
        locale: 'en_US',
        postalCodeFormat: '#####',
        stateKey: 'state',
    },
    CA: {
        locale: 'en_CA',
        postalCodeFormat: '@#@ #@#',
        stateKey: 'province',
    },
    JP: {
        locale: 'ja',
        postalCodeFormat: '###-####',
        stateKey: 'prefecture',
    },
    SG: {
        locale: 'en_SG',
        postalCodeFormat: '######',
        stateKey: 'area',
    },
    GB: {
        locale: 'en_GB',
        postalCodeFormat: '@# #@@',
        stateKey: 'county',
    }
};

function generateRandomAge(min = 18, max = 80) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomWeight(min = 45, max = 120) {
    return (Math.random() * (max - min) + min).toFixed(1);
}

function getRandomHobbies(count = 3) {
    const shuffled = HOBBIES.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

export function generateAddress(country = 'US') {
    const config = COUNTRY_CONFIGS[country];
    faker.locale = config.locale;

    const gender = Math.random() > 0.5 ? 'Male' : 'Female';
    const firstName = faker.person.firstName(gender.toLowerCase());
    const lastName = faker.person.lastName();

    const address = {
        name: `${firstName} ${lastName}`,
        gender: gender,
        age: generateRandomAge(),
        email: faker.internet.email({ firstName, lastName }),
        occupation: OCCUPATIONS[Math.floor(Math.random() * OCCUPATIONS.length)],
        weight: generateRandomWeight(),
        hobbies: getRandomHobbies(),
        address: {
            street: faker.location.streetAddress(),
            city: faker.location.city(),
            [config.stateKey]: faker.location.state(),
            country: country,
            postalCode: faker.location.zipCode(config.postalCodeFormat),
        }
    };

    return address;
}

export function getTaxFreeStates() {
    return Object.entries(TAX_FREE_STATES).map(([name, code]) => ({
        name,
        code,
        description: `${name} (${code}) is a tax-free state with no state sales tax.`
    }));
}
