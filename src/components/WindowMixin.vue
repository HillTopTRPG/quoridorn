<script>
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  data () {
    return {
      command: {}
    }
  },
  methods: {
    ...mapActions([])
    // command (command) {
    //   this.$command[command.command] = command.payload
    // },
    // getCommandParam (command) {
    //   return this.$command[command]
    // }
  },
  computed: mapState({
    ...mapGetters([])
  })
}
</script>
