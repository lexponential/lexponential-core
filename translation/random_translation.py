from random import sample

def translate(str, fromLang, toLang):
    vowels = "aeiou"
    consonants = "bcdfghjklmnpqrstvwxyz"
    patterns = ["CVC", "CVVC", "CVCV", "VC", "VCV", "VCVC", "CV"]
    pattern = sample(patterns, 1)[0]
    translation = ''
    for character in pattern:
        if character == "C":
            translation = translation + sample(list(consonants), 1)[0]
        else:
            translation = translation + sample(list(vowels), 1)[0]
    return translation
