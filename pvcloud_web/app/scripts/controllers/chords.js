
var chordsModule = function () {
    var target = process.argv[2];

    return returnChords(target);
    
    function returnChords(target) {
        var wisdom = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

        var pos0 = wisdom.indexOf(target);

        if (pos0 >= 0) {
            var pos1 = pos0 + 4;
            var pos2 = pos0 + 7;
            var pos3 = pos0 + 12;

            var tune0 = wisdom[pos0];
            var tune1 = wisdom[pos1];
            var tune2 = wisdom[pos2];
            var tune3 = wisdom[pos3];

            var result = [tune0, tune1, tune2, tune3];
            console.log(result);
            return result;
        } else {
            throw "Invalid Tune Provided";
        }
    }
};

exports.Chords = chordsModule();
        