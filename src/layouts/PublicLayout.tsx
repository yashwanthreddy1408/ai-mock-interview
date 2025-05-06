import Container from "@/components/Container"
import Footer from "@/components/Footer"
import Header from "@/components/Header"
import AuthHandler from "@/handlers/AuthHandler"
import { Outlet } from "react-router-dom"
import { motion } from "framer-motion"

const PublicLayout = () => {
  return (
    <div className="w-full min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50">
      {/* handler to store the user data */}
      <AuthHandler />

      {/* Animated Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm"
      >
        <Header />
      </motion.header>

      {/* Main Content */}
      <main className="flex-grow">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Container className="py-8 sm:py-12">
            <Outlet />
          </Container>
        </motion.div>
      </main>

      {/* Footer with subtle animation */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: "0px 0px -100px 0px" }}
        className="bg-gray-900 text-white"
      >
        <Footer />
      </motion.footer>
    </div>
  )
}

export default PublicLayout